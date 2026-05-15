/**
 * schedule.js
 * Generates a summary schedule view showing multiple upcoming runs
 * with grouping by day and relative time labels.
 */

const { getNextRuns } = require('./nextRun');
const { formatDate, formatRelative } = require('./formatter');

const DAY_LABELS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function groupByDay(dates) {
  const groups = {};
  for (const date of dates) {
    const key = date.toDateString();
    if (!groups[key]) {
      groups[key] = { label: getDayLabel(date), runs: [] };
    }
    groups[key].runs.push(date);
  }
  return Object.values(groups);
}

function getDayLabel(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target - today) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return DAY_LABELS[date.getDay()];
  return formatDate(date).split(' ').slice(0, 3).join(' ');
}

function buildSchedule(cronExpression, options = {}) {
  const { count = 10, from = new Date() } = options;
  const runs = getNextRuns(cronExpression, count, from);

  if (!runs || runs.length === 0) {
    return { groups: [], total: 0 };
  }

  const groups = groupByDay(runs);
  return { groups, total: runs.length };
}

function formatSchedule(cronExpression, options = {}) {
  const { groups, total } = buildSchedule(cronExpression, options);

  if (total === 0) {
    return 'No upcoming runs found.';
  }

  const lines = [`Upcoming ${total} run(s):`, ''];

  for (const group of groups) {
    lines.push(`  ${group.label}`);
    for (const run of group.runs) {
      const time = run.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const rel = formatRelative(run);
      lines.push(`    ${time}  (${rel})`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

module.exports = { groupByDay, getDayLabel, buildSchedule, formatSchedule };
