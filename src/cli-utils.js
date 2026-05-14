'use strict';

const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function printBanner() {
  console.log(`${BOLD}${CYAN}\n  cronlens${RESET} — human-readable cron parser\n`);
}

function printHelp() {
  printBanner();
  console.log(`  ${BOLD}Usage:${RESET}`);
  console.log(`    cronlens <expression> [--count <n>]\n`);
  console.log(`  ${BOLD}Options:${RESET}`);
  console.log(`    --count <n>   Number of next runs to show (1-20, default: 5)`);
  console.log(`    --help, -h    Show this help message\n`);
  console.log(`  ${BOLD}Examples:${RESET}`);
  console.log(`    ${YELLOW}cronlens "0 9 * * 1-5"${RESET}`);
  console.log(`    ${YELLOW}cronlens "*/15 * * * *" --count 3${RESET}`);
  console.log(`    ${YELLOW}cronlens "@daily"${RESET}\n`);
}

function printError(message) {
  console.error(`\n  ${RED}${BOLD}Error:${RESET} ${message}\n`);
}

module.exports = { printBanner, printHelp, printError, BOLD, CYAN, RED, YELLOW, RESET };
