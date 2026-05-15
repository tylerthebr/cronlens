/**
 * explain.js — Produces a structured breakdown of a cron expression
 * field by field, combining parser + humanizer output.
 */

const { parseCron } = require('./parser');
const { humanizePart } = require('./humanizer');

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];
const FIELD_RANGES = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 },
];

/**
 * Returns an array of field explanation objects.
 * @param {string} expression
 * @returns {Array<{field: string, raw: string, description: string, isWildcard: boolean}>}
 */
function explainFields(expression) {
  const parts = parseCron(expression);

  return parts.map((raw, i) => ({
    field: FIELD_NAMES[i],
    raw,
    description: humanizePart(raw, i, FIELD_RANGES[i]),
    isWildcard: raw === '*',
  }));
}

/**
 * Returns a full explanation object for a cron expression.
 * @param {string} expression
 * @returns {{ expression: string, fields: Array, summary: string }}
 */
function explainCron(expression) {
  const fields = explainFields(expression);

  const nonWildcard = fields.filter((f) => !f.isWildcard);
  const summary =
    nonWildcard.length === 0
      ? 'Runs every minute'
      : 'Runs ' + nonWildcard.map((f) => `${f.description} (${f.field})`).join(', ');

  return { expression, fields, summary };
}

module.exports = { explainFields, explainCron };
