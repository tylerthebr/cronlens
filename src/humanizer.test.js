const { humanizeCron, humanizePart } = require('./humanizer');

describe('humanizePart', () => {
  test('returns null for wildcard', () => {
    expect(humanizePart('*', 'minute')).toBeNull();
  });

  test('handles step values', () => {
    expect(humanizePart('*/5', 'minute')).toBe('every 5 minutes');
    expect(humanizePart('*/2', 'hour')).toBe('every 2 hours');
  });

  test('handles comma-separated weekdays', () => {
    expect(humanizePart('1,3,5', 'weekday')).toBe('Monday, Wednesday, Friday');
  });

  test('handles range for months', () => {
    expect(humanizePart('3-5', 'month')).toBe('March through May');
  });

  test('handles single weekday', () => {
    expect(humanizePart('0', 'weekday')).toBe('Sunday');
    expect(humanizePart('6', 'weekday')).toBe('Saturday');
  });

  test('handles single month', () => {
    expect(humanizePart('12', 'month')).toBe('December');
  });

  test('returns raw value for plain numbers', () => {
    expect(humanizePart('15', 'minute')).toBe('15');
  });
});

describe('humanizeCron', () => {
  test('every minute', () => {
    const result = humanizeCron({ minute: '*', hour: '*', dom: '*', month: '*', dow: '*' });
    expect(result).toBe('every minute of every hour');
  });

  test('specific time', () => {
    const result = humanizeCron({ minute: '30', hour: '9', dom: '*', month: '*', dow: '*' });
    expect(result).toContain('9:30');
  });

  test('includes weekday info', () => {
    const result = humanizeCron({ minute: '0', hour: '8', dom: '*', month: '*', dow: '1' });
    expect(result).toContain('Monday');
  });

  test('includes month info', () => {
    const result = humanizeCron({ minute: '0', hour: '0', dom: '1', month: '1', dow: '*' });
    expect(result).toContain('January');
  });
});
