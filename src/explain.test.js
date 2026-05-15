const { explainFields, explainCron } = require('./explain');

describe('explainFields', () => {
  it('returns 5 field objects for a standard expression', () => {
    const fields = explainFields('0 9 * * 1');
    expect(fields).toHaveLength(5);
  });

  it('marks wildcard fields correctly', () => {
    const fields = explainFields('0 9 * * 1');
    expect(fields[2].isWildcard).toBe(true); // day of month
    expect(fields[3].isWildcard).toBe(true); // month
    expect(fields[0].isWildcard).toBe(false); // minute
  });

  it('includes correct field names', () => {
    const fields = explainFields('* * * * *');
    const names = fields.map((f) => f.field);
    expect(names).toEqual(['minute', 'hour', 'day of month', 'month', 'day of week']);
  });

  it('preserves the raw value for each field', () => {
    const fields = explainFields('30 14 1 6 *');
    expect(fields[0].raw).toBe('30');
    expect(fields[1].raw).toBe('14');
    expect(fields[2].raw).toBe('1');
    expect(fields[3].raw).toBe('6');
    expect(fields[4].raw).toBe('*');
  });

  it('provides a description string for each field', () => {
    const fields = explainFields('*/5 * * * *');
    expect(typeof fields[0].description).toBe('string');
    expect(fields[0].description.length).toBeGreaterThan(0);
  });
});

describe('explainCron', () => {
  it('returns the original expression', () => {
    const result = explainCron('0 0 * * *');
    expect(result.expression).toBe('0 0 * * *');
  });

  it('returns a summary string', () => {
    const result = explainCron('0 9 * * 1');
    expect(typeof result.summary).toBe('string');
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it('summary says "Runs every minute" for wildcard expression', () => {
    const result = explainCron('* * * * *');
    expect(result.summary).toBe('Runs every minute');
  });

  it('summary mentions non-wildcard fields', () => {
    const result = explainCron('0 9 * * *');
    expect(result.summary).toContain('minute');
    expect(result.summary).toContain('hour');
  });

  it('includes fields array with 5 items', () => {
    const result = explainCron('*/15 * * * *');
    expect(result.fields).toHaveLength(5);
  });
});
