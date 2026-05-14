const { validateCron, parseAndValidate, inRange } = require('./validator');
const { parseCron } = require('./parser');

describe('inRange', () => {
  test('returns true for value within range', () => {
    expect(inRange(5, { min: 0, max: 59 })).toBe(true);
  });

  test('returns true for boundary values', () => {
    expect(inRange(0, { min: 0, max: 59 })).toBe(true);
    expect(inRange(59, { min: 0, max: 59 })).toBe(true);
  });

  test('returns false for value out of range', () => {
    expect(inRange(60, { min: 0, max: 59 })).toBe(false);
    expect(inRange(-1, { min: 0, max: 59 })).toBe(false);
  });
});

describe('validateCron', () => {
  test('returns valid for a correctly parsed cron', () => {
    const parsed = parseCron('0 12 * * 1');
    const result = validateCron(parsed);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('returns invalid when passed null', () => {
    const result = validateCron(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('catches out-of-range values in parsed object', () => {
    const badParsed = {
      minute: [61],
      hour: [25],
      dayOfMonth: [32],
      month: [13],
      dayOfWeek: [8],
    };
    const result = validateCron(badParsed);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(5);
  });
});

describe('parseAndValidate', () => {
  test('returns valid result for a standard expression', () => {
    const result = parseAndValidate('*/5 * * * *');
    expect(result.valid).toBe(true);
    expect(result.parsed).not.toBeNull();
  });

  test('returns invalid for a completely malformed expression', () => {
    const result = parseAndValidate('not a cron');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.parsed).toBeNull();
  });

  test('returns invalid for expression with too few fields', () => {
    const result = parseAndValidate('* * *');
    expect(result.valid).toBe(false);
  });
});
