const { parseCron } = require('./parser');

describe('parseCron', () => {
  test('parses a standard cron expression', () => {
    const result = parseCron('0 12 * * 1');
    expect(result).toEqual({
      minute: '0',
      hour: '12',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '1',
    });
  });

  test('parses wildcard step expression', () => {
    const result = parseCron('*/15 * * * *');
    expect(result.minute).toBe('*/15');
  });

  test('parses range expression', () => {
    const result = parseCron('0 9-17 * * 1-5');
    expect(result.hour).toBe('9-17');
    expect(result.dayOfWeek).toBe('1-5');
  });

  test('parses comma-separated values', () => {
    const result = parseCron('0 8,12,18 * * *');
    expect(result.hour).toBe('8,12,18');
  });

  test('resolves month aliases', () => {
    const result = parseCron('0 0 1 jan *');
    expect(result.month).toBe('jan');
  });

  test('throws on wrong number of fields', () => {
    expect(() => parseCron('* * * *')).toThrow('Expected 5 fields');
  });

  test('throws on out-of-range minute', () => {
    expect(() => parseCron('60 * * * *')).toThrow('Invalid value "60" for field "minute"');
  });

  test('throws on invalid hour value', () => {
    expect(() => parseCron('0 25 * * *')).toThrow('Invalid value "25" for field "hour"');
  });

  test('throws on non-string input', () => {
    expect(() => parseCron(null)).toThrow('Expression must be a string');
  });

  test('throws on invalid day of month', () => {
    expect(() => parseCron('0 0 0 * *')).toThrow('Invalid value "0" for field "dayOfMonth"');
  });
});
