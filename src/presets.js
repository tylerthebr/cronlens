// Common cron expression presets with labels and descriptions
const PRESETS = [
  {
    label: '@yearly',
    expression: '0 0 1 1 *',
    description: 'Run once a year at midnight on January 1st'
  },
  {
    label: '@monthly',
    expression: '0 0 1 * *',
    description: 'Run once a month at midnight on the 1st'
  },
  {
    label: '@weekly',
    expression: '0 0 * * 0',
    description: 'Run once a week at midnight on Sunday'
  },
  {
    label: '@daily',
    expression: '0 0 * * *',
    description: 'Run once a day at midnight'
  },
  {
    label: '@hourly',
    expression: '0 * * * *',
    description: 'Run once an hour at the beginning of the hour'
  },
  {
    label: '@reboot',
    expression: null,
    description: 'Run at startup (not a standard cron time expression)'
  }
];

/**
 * Resolve a preset alias like @daily to its cron expression.
 * Returns null if no match or if the preset has no expression.
 * @param {string} input
 * @returns {string|null}
 */
function resolvePreset(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.trim().toLowerCase();
  const preset = PRESETS.find(p => p.label === normalized);
  if (!preset) return null;
  return preset.expression || null;
}

/**
 * Check if a string looks like a preset alias.
 * @param {string} input
 * @returns {boolean}
 */
function isPreset(input) {
  if (!input || typeof input !== 'string') return false;
  return input.trim().startsWith('@');
}

/**
 * Get all presets as an array.
 * @returns {Array}
 */
function listPresets() {
  return PRESETS.map(p => ({ ...p }));
}

module.exports = { PRESETS, resolvePreset, isPreset, listPresets };
