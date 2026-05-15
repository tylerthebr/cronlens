const fs = require('fs');
const path = require('path');
const os = require('os');

// Override HISTORY_FILE path before requiring module
const TEST_HISTORY_FILE = path.join(os.tmpdir(), '.cronlens_history_test');

jest.mock('os', () => ({
  ...jest.requireActual('os'),
  homedir: () => require('os').tmpdir(),
}));

const { addToHistory, clearHistory, getHistory, MAX_HISTORY } = require('./history');

beforeEach(() => {
  clearHistory();
});

afterAll(() => {
  try { fs.unlinkSync(TEST_HISTORY_FILE); } catch {}
});

describe('getHistory', () => {
  it('returns empty array when no history exists', () => {
    expect(getHistory()).toEqual([]);
  });
});

describe('addToHistory', () => {
  it('adds a new expression to history', () => {
    addToHistory('* * * * *');
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].expression).toBe('* * * * *');
    expect(history[0].timestamp).toBeDefined();
  });

  it('prepends new entries so most recent is first', () => {
    addToHistory('0 * * * *');
    addToHistory('0 9 * * 1');
    const history = getHistory();
    expect(history[0].expression).toBe('0 9 * * 1');
    expect(history[1].expression).toBe('0 * * * *');
  });

  it('deduplicates expressions, moving existing to top', () => {
    addToHistory('* * * * *');
    addToHistory('0 0 * * *');
    addToHistory('* * * * *');
    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].expression).toBe('* * * * *');
  });

  it('trims history to MAX_HISTORY entries', () => {
    for (let i = 0; i < MAX_HISTORY + 5; i++) {
      addToHistory(`${i} * * * *`);
    }
    expect(getHistory()).toHaveLength(MAX_HISTORY);
  });

  it('ignores empty or non-string input', () => {
    addToHistory('');
    addToHistory(null);
    addToHistory(undefined);
    expect(getHistory()).toHaveLength(0);
  });
});

describe('clearHistory', () => {
  it('clears all history entries', () => {
    addToHistory('* * * * *');
    addToHistory('0 0 * * *');
    clearHistory();
    expect(getHistory()).toHaveLength(0);
  });
});
