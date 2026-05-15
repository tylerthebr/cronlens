/**
 * explain-display.js — Renders the structured cron explanation to the terminal.
 */

const { explainCron } = require('./explain');

const FIELD_COL_WIDTH = 14;
const RAW_COL_WIDTH = 10;

/**
 * Pads a string to a given length.
 * @param {string} str
 * @param {number} len
 * @returns {string}
 */
function pad(str, len) {
  return String(str).padEnd(len, ' ');
}

/**
 * Formats a single field row for display.
 * @param {{ field: string, raw: string, description: string, isWildcard: boolean }} fieldObj
 * @returns {string}
 */
function formatFieldRow(fieldObj) {
  const wildcard = fieldObj.isWildcard ? '(any)' : '';
  const desc = fieldObj.isWildcard ? wildcard : fieldObj.description;
  return `  ${pad(fieldObj.field, FIELD_COL_WIDTH)}${pad(fieldObj.raw, RAW_COL_WIDTH)}${desc}`;
}

/**
 * Builds the full explanation table as a string.
 * @param {string} expression
 * @returns {string}
 */
function buildExplainTable(expression) {
  const { fields, summary } = explainCron(expression);

  const header = `  ${pad('FIELD', FIELD_COL_WIDTH)}${pad('VALUE', RAW_COL_WIDTH)}DESCRIPTION`;
  const divider = '  ' + '-'.repeat(FIELD_COL_WIDTH + RAW_COL_WIDTH + 20);
  const rows = fields.map(formatFieldRow);

  return [
    '',
    `  Expression: ${expression}`,
    `  Summary:    ${summary}`,
    '',
    header,
    divider,
    ...rows,
    '',
  ].join('\n');
}

/**
 * Prints the explanation table to stdout.
 * @param {string} expression
 */
function printExplain(expression) {
  console.log(buildExplainTable(expression));
}

module.exports = { formatFieldRow, buildExplainTable, printExplain };
