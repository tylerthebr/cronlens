const { groupByDay, getDayLabel, buildSchedule, formatSchedule } = require('./schedule');

describe('getDayLabel', () => {
  it('returns Today for current date', () => {
    const now = new Date();
    expect(getDayLabel(now)).toBe('Today');
  });

  it('returns Tomorrow for next day', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getDayLabel(tomorrow)).toBe('Tomorrow');
  });

  it('returns day name for within a week', () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    expect(days).toContain(getDayLabel(soon));
  });
});

describe('groupByDay', () => {
  it('groups dates by calendar day', () => {
    const base = new Date(2025, 0, 15, 10, 0, 0);
    const d1 = new Date(2025, 0, 15, 10, 0);
    const d2 = new Date(2025, 0, 15, 14, 0);
    const d3 = new Date(2025, 0, 16, 9, 0);
    const groups = groupByDay([d1, d2, d3]);
    expect(groups).toHaveLength(2);
    expect(groups[0].runs).toHaveLength(2);
    expect(groups[1].runs).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('buildSchedule', () => {
  it('returns correct total count', () => {
    const from = new Date(2025, 0, 1, 0, 0, 0);
    const result = buildSchedule('* * * * *', { count: 5, from });
    expect(result.total).toBe(5);
  });

  it('groups results by day', () => {
    const from = new Date(2025, 0, 1, 0, 0, 0);
    const result = buildSchedule('0 9 * * *', { count: 3, from });
    expect(result.groups.length).toBeGreaterThan(0);
    expect(result.groups[0].runs).toBeDefined();
  });

  it('returns empty for invalid expression', () => {
    const result = buildSchedule('invalid', { count: 5 });
    expect(result.total).toBe(0);
  });
});

describe('formatSchedule', () => {
  it('returns string output', () => {
    const from = new Date(2025, 0, 1, 0, 0, 0);
    const output = formatSchedule('0 9 * * *', { count: 2, from });
    expect(typeof output).toBe('string');
    expect(output).toContain('run(s)');
  });

  it('shows no runs message for invalid cron', () => {
    const output = formatSchedule('invalid');
    expect(output).toBe('No upcoming runs found.');
  });
});
