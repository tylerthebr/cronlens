const { diffFields, diffCrons, formatDiff } = require('./diff');

describe('diffFields', () => {
  test('returns no changes when fields are identical', () => {
    const a = { minute: '0', hour: '9', dom: '*', month: '*', dow: '*' };
    const b = { minute: '0', hour: '9', dom: '*', month: '*', dow: '*' };
    const result = diffFields(a, b);
    expect(result.every(d => !d.changed)).toBe(true);
  });

  test('detects changed fields', () => {
    const a = { minute: '0', hour: '9', dom: '*', month: '*', dow: '*' };
    const b = { minute: '30', hour: '9', dom: '*', month: '*', dow: '*' };
    const result = diffFields(a, b);
    const minuteDiff = result.find(d => d.field === 'minute');
    expect(minuteDiff.changed).toBe(true);
    expect(minuteDiff.from).toBe('0');
    expect(minuteDiff.to).toBe('30');
  });

  test('marks unchanged fields correctly', () => {
    const a = { minute: '0', hour: '9', dom: '*', month: '*', dow: '*' };
    const b = { minute: '0', hour: '17', dom: '*', month: '*', dow: '*' };
    const result = diffFields(a, b);
    const minuteDiff = result.find(d => d.field === 'minute');
    const hourDiff = result.find(d => d.field === 'hour');
    expect(minuteDiff.changed).toBe(false);
    expect(hourDiff.changed).toBe(true);
  });

  test('handles all fields changing', () => {
    const a = { minute: '0', hour: '0', dom: '1', month: '1', dow: '0' };
    const b = { minute: '59', hour: '23', dom: '31', month: '12', dow: '6' };
    const result = diffFields(a, b);
    expect(result.every(d => d.changed)).toBe(true);
  });
});

describe('diffCrons', () => {
  test('returns parsed diff for two valid expressions', () => {
    const result = diffCrons('0 9 * * *', '30 9 * * *');
    expect(result.valid).toBe(true);
    expect(result.diffs).toBeDefined();
    expect(Array.isArray(result.diffs)).toBe(true);
  });

  test('returns error for invalid first expression', () => {
    const result = diffCrons('invalid', '0 9 * * *');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('returns error for invalid second expression', () => {
    const result = diffCrons('0 9 * * *', 'bad expr');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('includes humanized descriptions in result', () => {
    const result = diffCrons('0 9 * * 1', '0 9 * * 5');
    expect(result.valid).toBe(true);
    expect(result.descA).toBeDefined();
    expect(result.descB).toBeDefined();
  });
});

describe('formatDiff', () => {
  test('returns a non-empty string', () => {
    const result = diffCrons('0 9 * * *', '0 17 * * *');
    const output = formatDiff(result);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
  });

  test('includes field names in output', () => {
    const result = diffCrons('0 9 * * *', '0 17 * * *');
    const output = formatDiff(result);
    expect(output).toMatch(/hour/i);
  });

  test('shows error message for invalid diff result', () => {
    const result = { valid: false, error: 'Invalid expression' };
    const output = formatDiff(result);
    expect(output).toMatch(/invalid/i);
  });
});
