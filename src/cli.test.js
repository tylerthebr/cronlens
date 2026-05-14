'use strict';

jest.mock('./cli-utils', () => ({
  printBanner: jest.fn(),
  printHelp: jest.fn(),
  printError: jest.fn(),
}));

const { printHelp, printError, printBanner } = require('./cli-utils');
const { parseCron } = require('./parser');
const { humanizeCron } = require('./humanizer');
const { getNextRuns } = require('./nextRun');
const { formatOutput } = require('./formatter');

function runCli(args) {
  jest.resetModules();
  const originalArgv = process.argv;
  process.argv = ['node', 'cli.js', ...args];
  try {
    require('./cli');
  } catch (e) {
    // process.exit throws in test env
  } finally {
    process.argv = originalArgv;
  }
}

describe('cli integration', () => {
  let consoleSpy;
  let exitSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('calls printHelp when no args provided', () => {
    try { runCli([]); } catch (_) {}
    expect(printHelp).toHaveBeenCalled();
  });

  it('calls printHelp with --help flag', () => {
    try { runCli(['--help']); } catch (_) {}
    expect(printHelp).toHaveBeenCalled();
  });

  it('calls printError for invalid expression', () => {
    try { runCli(['invalid expression here foo bar']); } catch (_) {}
    expect(printError).toHaveBeenCalled();
  });
});
