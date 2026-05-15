/**
 * schedule-display.js
 * Handles printing the schedule view to the terminal with color support.
 */

const { buildSchedule } = require('./schedule');
const { formatRelative } = require('./formatter');

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
};

function colorize(text, ...codes) {
  return codes.map(c => COLORS[c] || '').join('') + text + COLORS.reset;
}

function formatTimeEntry(run) {
  const time = run.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const rel = formatRelative(run);
  return `    ${colorize(time, 'green')}  ${colorize(`(${rel})`, 'dim')}`;
}

function printSchedule(cronExpression, options = {}) {
  const { count = 10, from = new Date(), noColor = false } = options;
  const { groups, total } = buildSchedule(cronExpression, { count, from });

  if (total === 0) {
    console.log(noColor ? 'No upcoming runs found.' : colorize('No upcoming runs found.', 'yellow'));
    return;
  }

  const header = `Upcoming ${total} run(s):`;
  console.log(noColor ? header : colorize(header, 'bold', 'cyan'));
  console.log();

  for (const group of groups) {
    const dayLine = `  ${group.label}`;
    console.log(noColor ? dayLine : colorize(dayLine, 'bold', 'yellow'));

    for (const run of group.runs) {
      const entry = formatTimeEntry(run);
      console.log(noColor ? entry.replace(/\x1b\[[0-9;]*m/g, '') : entry);
    }

    console.log();
  }
}

module.exports = { colorize, formatTimeEntry, printSchedule };
