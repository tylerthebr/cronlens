/**
 * diff.js — Compare two cron expressions and highlight differences
 */

const { parseCron } = require('./parser');
const { humanizeCron } = require('./humanizer');

const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];

/**
 * Compare two parsed cron field arrays and return diff info
 * @param {string[]} fieldsA
 * @param {string[]} fieldsB
 * @returns {{ index: number, name: string, a: string, b: string }[]}
 */
function diffFields(fieldsA, fieldsB) {
  const diffs = [];
  for (let i = 0; i < 5; i++) {
    if (fieldsA[i] !== fieldsB[i]) {
      diffs.push({
        index: i,
        name: FIELD_NAMES[i],
        a: fieldsA[i],
        b: fieldsB[i],
      });
    }
  }
  return diffs;
}

/**
 * Compare two cron expressions and return a structured diff result
 * @param {string} exprA
 * @param {string} exprB
 * @returns {{ identical: boolean, diffs: object[], humanA: string, humanB: string }}
 */
function diffCrons(exprA, exprB) {
  const fieldsA = parseCron(exprA);
  const fieldsB = parseCron(exprB);

  const diffs = diffFields(fieldsA, fieldsB);
  const humanA = humanizeCron(exprA);
  const humanB = humanizeCron(exprB);

  return {
    identical: diffs.length === 0,
    diffs,
    humanA,
    humanB,
  };
}

/**
 * Format a diff result as a human-readable string
 * @param {string} exprA
 * @param {string} exprB
 * @returns {string}
 */
function formatDiff(exprA, exprB) {
  const result = diffCrons(exprA, exprB);
  const lines = [];

  lines.push(`A: ${exprA}  →  ${result.humanA}`);
  lines.push(`B: ${exprB}  →  ${result.humanB}`);
  lines.push('');

  if (result.identical) {
    lines.push('✓ Expressions are identical');
  } else {
    lines.push(`${result.diffs.length} difference(s) found:`);
    for (const d of result.diffs) {
      lines.push(`  [${d.name}]  "${d.a}"  →  "${d.b}"`);
    }
  }

  return lines.join('\n');
}

module.exports = { diffFields, diffCrons, formatDiff };
