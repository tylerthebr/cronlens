/**
 * Formats cron validation and next-run data for terminal output.
 */

/**
 * Pads a string on the right to a given length.
 * @param {string} str
 * @param {number} len
 * @returns {string}
 */
function padRight(str, len) {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

/**
 * Formats a Date object as a readable local date/time string.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
}

/**
 * Returns a human-readable relative time string (e.g. "in 3 minutes").
 * @param {Date} date
 * @param {Date} [now]
 * @returns {string}
 */
function formatRelative(date, now = new Date()) {
  const diffMs = date - now;
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return `in ${diffSec} second${diffSec !== 1 ? 's' : ''}`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `in ${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `in ${diffHr} hour${diffHr !== 1 ? 's' : ''}`;
  const diffDay = Math.round(diffHr / 24);
  return `in ${diffDay} day${diffDay !== 1 ? 's' : ''}`;
}

/**
 * Formats a full output block for the CLI.
 * @param {object} options
 * @param {string} options.expression - The original cron expression
 * @param {string} options.humanized - Human-readable description
 * @param {Date[]} options.nextRuns - Array of upcoming run dates
 * @param {boolean} options.valid - Whether the expression is valid
 * @param {string[]} options.errors - Validation errors if any
 * @returns {string}
 */
function formatOutput({ expression, humanized, nextRuns = [], valid, errors = [] }) {
  const lines = [];
  lines.push(`Expression : ${expression}`);
  lines.push(`Humanized  : ${humanized}`);
  lines.push(`Valid      : ${valid ? '\u2705 Yes' : '\u274C No'}`);

  if (!valid && errors.length > 0) {
    lines.push('Errors     :');
    errors.forEach((e) => lines.push(`  - ${e}`));
  }

  if (valid && nextRuns.length > 0) {
    lines.push('Next runs  :');
    const now = new Date();
    nextRuns.forEach((run, i) => {
      const index = padRight(`  ${i + 1}.`, 6);
      lines.push(`${index}${formatDate(run)}  (${formatRelative(run, now)})`);
    });
  }

  return lines.join('\n');
}

module.exports = { padRight, formatDate, formatRelative, formatOutput };
