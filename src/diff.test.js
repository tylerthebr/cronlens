const { diffFields, diffCrons, formatDiff } = require('./diff');

describe('diffFields', () => {
  test('returns empty array for identical fields', () => {
    const fields = ['0', '9', '*', '*', '1-5'];
    expect(diffFields(fields, fields)).toEqual([]);
  });

  test('detects a single changed field', () => {
    const a = ['0', '9', '*', '*', '1-5'];
    const b = ['0', '10', '*', '*', '1-5'];
    const diffs = diffFields(a, b);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].name).toBe('hour');
    expect(diffs[0].a).toBe('9');
    expect(diffs[0].b).toBe('10');
  });

  test('detects multiple changed fields', () => {
    const a = ['0', '9', '*', '*', '1-5'];
    const b = ['30', '9', '1', '*', '1-5'];
    const diffs = diffFields(a, b);
    expect(diffs).toHaveLength(2);
    expect(diffs.map(d => d.name)).toEqual(['minute', 'day of month']);
  });
});

describe('diffCrons', () => {
  test('identical expressions return identical: true', () => {
    const result = diffCrons('0 9 * * 1-5', '0 9 * * 1-5');
    expect(result.identical).toBe(true);
    expect(result.diffs).toHaveLength(0);
  });

  test('different expressions return identical: false with diffs', () => {
    const result = diffCrons('0 9 * * 1-5', '0 17 * * 1-5');
    expect(result.identical).toBe(false);
    expect(result.diffs).toHaveLength(1);
    expect(result.diffs[0].index).toBe(1);
  });

  test('includes humanized descriptions for both expressions', () => {
    const result = diffCrons('0 9 * * 1-5', '0 17 * * 1-5');
    expect(typeof result.humanA).toBe('string');
    expect(typeof result.humanB).toBe('string');
    expect(result.humanA.length).toBeGreaterThan(0);
  });
});

describe('formatDiff', () => {
  test('returns a string', () => {
    const out = formatDiff('0 9 * * 1-5', '0 17 * * 1-5');
    expect(typeof out).toBe('string');
  });

  test('includes identical message when expressions match', () => {
    const out = formatDiff('* * * * *', '* * * * *');
    expect(out).toContain('identical');
  });

  test('includes diff count and changed field name when different', () => {
    const out = formatDiff('0 9 * * 1-5', '0 17 * * 1-5');
    expect(out).toContain('1 difference');
    expect(out).toContain('hour');
  });

  test('shows both expressions in output', () => {
    const out = formatDiff('0 9 * * 1-5', '0 17 * * 1-5');
    expect(out).toContain('0 9 * * 1-5');
    expect(out).toContain('0 17 * * 1-5');
  });
});
