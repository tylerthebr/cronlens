const { getNextRuns, matchesField } = require('./nextRun');

describe('matchesField', () => {
  test('wildcard always matches', () => {
    expect(matchesField('*', 5)).toBe(true);
    expect(matchesField('*', 59)).toBe(true);
  });

  test('exact value match', () => {
    expect(matchesField('30', 30)).toBe(true);
    expect(matchesField('30', 31)).toBe(false);
  });

  test('step match', () => {
    expect(matchesField('*/15', 0)).toBe(true);
    expect(matchesField('*/15', 15)).toBe(true);
    expect(matchesField('*/15', 30)).toBe(true);
    expect(matchesField('*/15', 7)).toBe(false);
  });

  test('comma list match', () => {
    expect(matchesField('1,3,5', 3)).toBe(true);
    expect(matchesField('1,3,5', 2)).toBe(false);
  });

  test('range match', () => {
    expect(matchesField('9-17', 12)).toBe(true);
    expect(matchesField('9-17', 8)).toBe(false);
    expect(matchesField('9-17', 18)).toBe(false);
  });
});

describe('getNextRuns', () => {
  test('returns correct number of results', () => {
    const runs = getNextRuns('* * * * *', 5);
    expect(runs).toHaveLength(5);
  });

  test('each result is a Date object', () => {
    const runs = getNextRuns('0 * * * *', 3);
    runs.forEach(r => expect(r).toBeInstanceOf(Date));
  });

  test('results are in ascending order', () => {
    const runs = getNextRuns('*/10 * * * *', 4);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });

  test('throws on invalid expression', () => {
    expect(() => getNextRuns('99 * * * *')).toThrow();
  });

  test('hourly cron hits correct minutes', () => {
    const from = new Date('2024-01-01T00:00:00Z');
    const runs = getNextRuns('0 * * * *', 3, from);
    runs.forEach(r => expect(r.getMinutes()).toBe(0));
  });
});
