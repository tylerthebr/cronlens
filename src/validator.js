/**
 * Validates a full cron expression and returns structured results.
 */

const { parseCron } = require('./parser');

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];

const FIELD_RANGES = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
};

const FIELD_KEYS = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

/**
 * Validates a single numeric value against a range.
 * @param {number} value
 * @param {{ min: number, max: number }} range
 * @returns {boolean}
 */
function inRange(value, range) {
  return value >= range.min && value <= range.max;
}

/**
 * Validates a parsed cron object and returns a validation result.
 * @param {object} parsed - Result from parseCron
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateCron(parsed) {
  const errors = [];

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, errors: ['Invalid cron expression: could not parse'] };
  }

  FIELD_KEYS.forEach((key, index) => {
    const values = parsed[key];
    const range = FIELD_RANGES[key];
    const name = FIELD_NAMES[index];

    if (!Array.isArray(values)) {
      errors.push(`Field "${name}" is missing or invalid`);
      return;
    }

    values.forEach((val) => {
      if (!inRange(val, range)) {
        errors.push(
          `Field "${name}" has value ${val} out of range (${range.min}-${range.max})`
        );
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Full pipeline: parse then validate a cron string.
 * @param {string} expression
 * @returns {{ valid: boolean, errors: string[], parsed: object|null }}
 */
function parseAndValidate(expression) {
  let parsed = null;
  try {
    parsed = parseCron(expression);
  } catch (err) {
    return { valid: false, errors: [err.message], parsed: null };
  }

  const result = validateCron(parsed);
  return { ...result, parsed: result.valid ? parsed : null };
}

module.exports = { validateCron, parseAndValidate, inRange };
