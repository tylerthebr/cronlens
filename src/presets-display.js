const { listPresets } = require('./presets');

const COL_LABEL = 10;
const COL_EXPR = 16;

/**
 * Pad a string to a fixed width.
 * @param {string} str
 * @param {number} width
 * @returns {string}
 */
function pad(str, width) {
  return (str || '').padEnd(width);
}

/**
 * Format a single preset row for display.
 * @param {{ label: string, expression: string|null, description: string }} preset
 * @returns {string}
 */
function formatPresetRow(preset) {
  const expr = preset.expression || '(special)';
  return `  ${pad(preset.label, COL_LABEL)}  ${pad(expr, COL_EXPR)}  ${preset.description}`;
}

/**
 * Build the full presets table as a string.
 * @returns {string}
 */
function buildPresetsTable() {
  const header = `  ${pad('ALIAS', COL_LABEL)}  ${pad('EXPRESSION', COL_EXPR)}  DESCRIPTION`;
  const divider = '  ' + '-'.repeat(COL_LABEL) + '  ' + '-'.repeat(COL_EXPR) + '  ' + '-'.repeat(40);
  const rows = listPresets().map(formatPresetRow);
  return [header, divider, ...rows].join('\n');
}

/**
 * Print the presets table to stdout.
 */
function printPresets() {
  console.log('\nAvailable presets:\n');
  console.log(buildPresetsTable());
  console.log();
}

module.exports = { formatPresetRow, buildPresetsTable, printPresets };
