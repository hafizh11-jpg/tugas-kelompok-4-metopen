// ========================================
// logger.js - Logging System
// ========================================

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFile, level = 'info') {
    this.logFile = logFile;
    this.logLevel = level;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    this.ensureDirectory();
  }

  ensureDirectory() {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  log(level, message) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    // Terminal output with colors
    this.writeToTerminal(level, entry);
    
    // File logging
    this.writeToFile(entry);
  }

  writeToTerminal(level, entry) {
    const color = this.getColor(level);
    process.stdout.write(`${color}${entry}\x1b[0m`);
  }

  writeToFile(entry) {
    fs.appendFile(this.logFile, entry, (err) => {
      if (err) {
        console.error('Logger write error:', err.message);
      }
    });
  }

  getColor(level) {
    switch (level) {
      case 'debug': return '\x1b[38;5;246m';  // Gray
      case 'info':  return '\x1b[38;5;39m';   // Cyan
      case 'warn':  return '\x1b[38;5;214m';  // Orange
      case 'error': return '\x1b[38;5;196m';  // Red
      default:      return '\x1b[0m';
    }
  }

  debug(message) {
    this.log('debug', message);
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }

  success(message) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [SUCCESS] ${message}\n`;
    process.stdout.write(`\x1b[38;5;46m${entry}\x1b[0m`);
    this.writeToFile(entry);
  }

  getStats() {
    try {
      const stats = fs.statSync(this.logFile);
      return {
        size: stats.size,
        lines: fs.readFileSync(this.logFile, 'utf8').split('\n').length,
        lastModified: stats.mtime
      };
    } catch (err) {
      return { size: 0, lines: 0, lastModified: null };
    }
  }

  clear() {
    fs.writeFile(this.logFile, '', (err) => {
      if (err) {
        console.error('Failed to clear log:', err);
      } else {
        this.info('Log file cleared');
      }
    });
  }
}

module.exports = Logger;