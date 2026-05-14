'use strict';

const { printBanner, printHelp, printError } = require('./cli-utils');

describe('cli-utils', () => {
  let consoleSpy;
  let errorSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('printBanner', () => {
    it('should call console.log with cronlens branding', () => {
      printBanner();
      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('cronlens');
    });
  });

  describe('printHelp', () => {
    it('should print usage information', () => {
      printHelp();
      const allOutput = consoleSpy.mock.calls.map(c => c[0]).join('\n');
      expect(allOutput).toContain('Usage');
      expect(allOutput).toContain('--count');
      expect(allOutput).toContain('Examples');
    });

    it('should show example expressions', () => {
      printHelp();
      const allOutput = consoleSpy.mock.calls.map(c => c[0]).join('\n');
      expect(allOutput).toContain('@daily');
      expect(allOutput).toContain('*/15');
    });
  });

  describe('printError', () => {
    it('should call console.error with the message', () => {
      printError('something went wrong');
      expect(errorSpy).toHaveBeenCalled();
      const output = errorSpy.mock.calls[0][0];
      expect(output).toContain('something went wrong');
      expect(output).toContain('Error');
    });
  });
});
