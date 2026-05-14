/**
 * Parses and validates a cron expression into its component fields.
 */

const FIELDS = [
  { name: 'minute',     min: 0,  max: 59 },
  { name: 'hour',       min: 0,  max: 23 },
  { name: 'dayOfMonth', min: 1,  max: 31 },
  { name: 'month',      min: 1,  max: 12 },
  { name: 'dayOfWeek',  min: 0,  max: 7  },
];

const MONTH_ALIASES = {
  jan:1, feb:2, mar:3, apr:4, may:5, jun:6,
  jul:7, aug:8, sep:9, oct:10, nov:11, dec:12,
};

const DOW_ALIASES = {
  sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6,
};

function resolveAlias(value, aliases) {
  return aliases[value.toLowerCase()] !== undefined
    ? String(aliases[value.toLowerCase()])
    : value;
}

function validatePart(part, min, max, aliases = {}) {
  part = resolveAlias(part, aliases);
  if (part === '*') return true;
  if (/^\d+$/.test(part)) {
    const n = parseInt(part, 10);
    return n >= min && n <= max;
  }
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-').map(Number);
    return a >= min && b <= max && a <= b;
  }
  if (/^\*\/\d+$/.test(part)) {
    const step = parseInt(part.split('/')[1], 10);
    return step >= 1 && step <= max;
  }
  if (/^[\d,]+$/.test(part)) {
    return part.split(',').every(v => {
      const n = parseInt(v, 10);
      return n >= min && n <= max;
    });
  }
  return false;
}

function parseCron(expression) {
  if (typeof expression !== 'string') {
    throw new Error('Expression must be a string');
  }

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(`Expected 5 fields, got ${parts.length}`);
  }

  const result = {};
  for (let i = 0; i < FIELDS.length; i++) {
    const field = FIELDS[i];
    const aliases = field.name === 'month' ? MONTH_ALIASES
                  : field.name === 'dayOfWeek' ? DOW_ALIASES
                  : {};
    if (!validatePart(parts[i], field.min, field.max, aliases)) {
      throw new Error(`Invalid value "${parts[i]}" for field "${field.name}"`);
    }
    result[field.name] = parts[i];
  }

  return result;
}

module.exports = { parseCron, FIELDS };
