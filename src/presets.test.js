const { resolvePreset, isPreset, listPresets, PRESETS } = require('./presets');

describe('resolvePreset', () => {
  test('resolves @daily to correct expression', () => {
    expect(resolvePreset('@daily')).toBe('0 0 * * *');
  });

  test('resolves @hourly to correct expression', () => {
    expect(resolvePreset('@hourly')).toBe('0 * * * *');
  });

  test('resolves @weekly to correct expression', () => {
    expect(resolvePreset('@weekly')).toBe('0 0 * * 0');
  });

  test('resolves @monthly to correct expression', () => {
    expect(resolvePreset('@monthly')).toBe('0 0 1 * *');
  });

  test('resolves @yearly to correct expression', () => {
    expect(resolvePreset('@yearly')).toBe('0 0 1 1 *');
  });

  test('returns null for @reboot (no expression)', () => {
    expect(resolvePreset('@reboot')).toBeNull();
  });

  test('returns null for unknown preset', () => {
    expect(resolvePreset('@unknown')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(resolvePreset('')).toBeNull();
  });

  test('returns null for null input', () => {
    expect(resolvePreset(null)).toBeNull();
  });

  test('is case-insensitive', () => {
    expect(resolvePreset('@DAILY')).toBe('0 0 * * *');
    expect(resolvePreset('@Daily')).toBe('0 0 * * *');
  });

  test('handles extra whitespace', () => {
    expect(resolvePreset('  @daily  ')).toBe('0 0 * * *');
  });
});

describe('isPreset', () => {
  test('returns true for @-prefixed strings', () => {
    expect(isPreset('@daily')).toBe(true);
    expect(isPreset('@reboot')).toBe(true);
  });

  test('returns false for regular cron expressions', () => {
    expect(isPreset('0 0 * * *')).toBe(false);
  });

  test('returns false for empty or null', () => {
    expect(isPreset('')).toBe(false);
    expect(isPreset(null)).toBe(false);
  });
});

describe('listPresets', () => {
  test('returns all presets', () => {
    const list = listPresets();
    expect(list.length).toBe(PRESETS.length);
  });

  test('each preset has label and description', () => {
    listPresets().forEach(p => {
      expect(p).toHaveProperty('label');
      expect(p).toHaveProperty('description');
    });
  });

  test('returns copies, not originals', () => {
    const list = listPresets();
    list[0].label = 'mutated';
    expect(PRESETS[0].label).not.toBe('mutated');
  });
});
