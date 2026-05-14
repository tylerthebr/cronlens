/**
 * Converts parsed cron parts into a human-readable description.
 */

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function humanizePart(value, type) {
  if (value === '*') return null;

  if (value.includes('/')) {
    const [, step] = value.split('/');
    const labels = { minute: 'minute', hour: 'hour', day: 'day', month: 'month', weekday: 'weekday' };
    return `every ${step} ${labels[type]}${step > 1 ? 's' : ''}`;
  }

  if (value.includes(',')) {
    const parts = value.split(',');
    if (type === 'weekday') return parts.map(p => WEEKDAYS[parseInt(p)]).join(', ');
    if (type === 'month') return parts.map(p => MONTHS[parseInt(p) - 1]).join(', ');
    return parts.join(', ');
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-');
    if (type === 'weekday') return `${WEEKDAYS[parseInt(start)]} through ${WEEKDAYS[parseInt(end)]}`;
    if (type === 'month') return `${MONTHS[parseInt(start) - 1]} through ${MONTHS[parseInt(end) - 1]}`;
    return `${start} through ${end}`;
  }

  if (type === 'weekday') return WEEKDAYS[parseInt(value)];
  if (type === 'month') return MONTHS[parseInt(value) - 1];
  return value;
}

function humanizeCron({ minute, hour, dom, month, dow }) {
  const parts = [];

  const minuteDesc = humanizePart(minute, 'minute');
  const hourDesc = humanizePart(hour, 'hour');
  const domDesc = humanizePart(dom, 'day');
  const monthDesc = humanizePart(month, 'month');
  const dowDesc = humanizePart(dow, 'weekday');

  if (!minuteDesc && !hourDesc) {
    parts.push('every minute of every hour');
  } else if (!minuteDesc) {
    parts.push(`every minute past hour ${hour}`);
  } else if (!hourDesc) {
    parts.push(`at minute ${minute} of every hour`);
  } else {
    parts.push(`at ${hour.padStart ? hour : hour}:${minute.toString().padStart(2, '0')}`);
  }

  if (domDesc) parts.push(`on day ${domDesc} of the month`);
  if (monthDesc) parts.push(`in ${monthDesc}`);
  if (dowDesc) parts.push(`on ${dowDesc}`);

  return parts.join(', ');
}

module.exports = { humanizeCron, humanizePart };
