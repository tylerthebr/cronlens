/**
 * Formats next-run dates and cron descriptions for terminal output.
 */

const { humanizeCron } = require('./humanizer');
const { getNextRuns } = require('./nextRun');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';

function padRight(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function formatDate(date) {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function formatRelative(date, from = new Date()) {
  const diffMs = date.getTime() - from.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 60) return `in ${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `in ${diffHours}h ${diffMins % 60}m`;
  const diffDays = Math.floor(diffHours / 24);
  return `in ${diffDays}d ${diffHours % 24}h`;
}

function formatOutput(expression, parsedParts, count = 5) {
  const lines = [];

  lines.push(`${BOLD}${CYAN}cronlens${RESET}`);
  lines.push(`${DIM}${'─'.repeat(40)}${RESET}`);
  lines.push(`${BOLD}Expression:${RESET}  ${YELLOW}${expression}${RESET}`);

  const description = humanizeCron(parsedParts);
  lines.push(`${BOLD}Runs:${RESET}        ${description}`);
  lines.push('');

  lines.push(`${BOLD}Next ${count} run${count !== 1 ? 's' : ''}:${RESET}`);

  const runs = getNextRuns(expression, count);
  const now = new Date();

  runs.forEach((date, i) => {
    const index = `${DIM}${String(i + 1).padStart(2, ' ')}.${RESET}`;
    const formatted = formatDate(date);
    const relative = `${GREEN}${formatRelative(date, now)}${RESET}`;
    lines.push(`  ${index} ${padRight(formatted, 35)} ${relative}`);
  });

  lines.push(`${DIM}${'─'.repeat(40)}${RESET}`);
  return lines.join('\n');
}

module.exports = { formatOutput, formatDate, formatRelative };
