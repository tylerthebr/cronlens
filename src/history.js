/**
 * history.js
 * Tracks recently used cron expressions in a local history file.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_FILE = path.join(os.homedir(), '.cronlens_history');
const MAX_HISTORY = 20;

function readHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8').trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), 'utf8');
  } catch {
    // silently fail if we can't write
  }
}

function addToHistory(expression) {
  if (!expression || typeof expression !== 'string') return;
  const entries = readHistory();
  const timestamp = new Date().toISOString();

  // Remove duplicate if exists
  const filtered = entries.filter(e => e.expression !== expression);

  // Prepend new entry
  filtered.unshift({ expression, timestamp });

  // Trim to max
  const trimmed = filtered.slice(0, MAX_HISTORY);
  writeHistory(trimmed);
}

function clearHistory() {
  writeHistory([]);
}

function getHistory() {
  return readHistory();
}

module.exports = { addToHistory, clearHistory, getHistory, HISTORY_FILE, MAX_HISTORY };
