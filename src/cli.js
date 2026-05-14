#!/usr/bin/env node

'use strict';

const { parseCron } = require('./parser');
const { humanizeCron } = require('./humanizer');
const { getNextRuns } = require('./nextRun');
const { formatOutput } = require('./formatter');
const { printHelp, printError, printBanner } = require('./cli-utils');

const args = process.argv.slice(2);

function main(args) {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const countFlag = args.indexOf('--count');
  let count = 5;
  if (countFlag !== -1 && args[countFlag + 1]) {
    const parsed = parseInt(args[countFlag + 1], 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 20) {
      count = parsed;
    }
  }

  const expr = args.filter((a, i) => {
    if (a === '--count') return false;
    if (i > 0 && args[i - 1] === '--count') return false;
    return true;
  }).join(' ');

  if (!expr) {
    printError('No cron expression provided.');
    printHelp();
    process.exit(1);
  }

  try {
    const parsed = parseCron(expr);
    const human = humanizeCron(parsed);
    const nextRuns = getNextRuns(parsed, new Date(), count);
    printBanner();
    console.log(formatOutput(expr, human, nextRuns));
  } catch (err) {
    printError(err.message);
    process.exit(1);
  }
}

main(args);
