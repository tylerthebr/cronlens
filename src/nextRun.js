/**
 * Calculates the next N run times for a given cron expression.
 */

const { parseCron } = require('./parser');

function matchesField(value, fieldValue) {
  if (value === '*') return true;

  if (value.includes('/')) {
    const [base, step] = value.split('/');
    const start = base === '*' ? 0 : parseInt(base);
    return (fieldValue - start) % parseInt(step) === 0 && fieldValue >= start;
  }

  if (value.includes(',')) {
    return value.split(',').map(Number).includes(fieldValue);
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-').map(Number);
    return fieldValue >= start && fieldValue <= end;
  }

  return parseInt(value) === fieldValue;
}

function getNextRuns(expression, count = 5, fromDate = new Date()) {
  const parsed = parseCron(expression);
  if (!parsed.valid) {
    throw new Error(`Invalid cron expression: ${parsed.errors.join(', ')}`);
  }

  const { minute, hour, dom, month, dow } = parsed.parts;
  const results = [];
  const cursor = new Date(fromDate);

  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 525960; // minutes in a year
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    const m = cursor.getMinutes();
    const h = cursor.getHours();
    const d = cursor.getDate();
    const mo = cursor.getMonth() + 1;
    const wd = cursor.getDay();

    if (
      matchesField(minute, m) &&
      matchesField(hour, h) &&
      matchesField(dom, d) &&
      matchesField(month, mo) &&
      matchesField(dow, wd)
    ) {
      results.push(new Date(cursor));
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
    iterations++;
  }

  return results;
}

module.exports = { getNextRuns, matchesField };
