// ========================================
// notifier.js - Notification System
// ========================================

const notifier = require('node-notifier');
const path = require('path');

class Notifier {
  constructor() {
    this.desktopEnabled = true;
    this.terminalEnabled = true;
  }

  send(title, message, level = 'info', options = {}) {
    // Terminal notification with ANSI colors
    if (this.terminalEnabled) {
      const timestamp = new Date().toLocaleTimeString();
      const ansiCode = this.getAnsiCode(level);
      const icon = this.getIcon(level);
      
      process.stdout.write(
        `\x1b[${ansiCode}m${icon} [${timestamp}] ${title}: ${message}\x1b[0m\n`
      );
    }

    // Desktop notification
    if (this.desktopEnabled && level !== 'info') {
      const notificationOptions = {
        title: `Server Monitor - ${title}`,
        message: message,
        sound: level === 'critical',
        wait: false,
        timeout: 5
      };

      // Try to add icon if available
      try {
        const iconPath = level === 'critical' 
          ? path.join(__dirname, 'icons', 'alert.png')
          : path.join(__dirname, 'icons', 'info.png');
        
        if (require('fs').existsSync(iconPath)) {
          notificationOptions.icon = iconPath;
        }
      } catch (err) {
        // Ignore icon errors
      }

      notifier.notify(notificationOptions);
    }
  }

  getAnsiCode(level) {
    switch (level) {
      case 'critical': return '38;5;196';  // Red
      case 'warning':  return '38;5;214';  // Orange
      case 'info':     return '38;5;45';   // Cyan
      case 'success':  return '38;5;46';   // Green
      default:         return '38;5;255';  // White
    }
  }

  getIcon(level) {
    switch (level) {
      case 'critical': return '🔴';
      case 'warning':  return '🟡';
      case 'info':     return '🔵';
      case 'success':  return '🟢';
      default:         return '⚪';
    }
  }

  enableDesktop() {
    this.desktopEnabled = true;
  }

  disableDesktop() {
    this.desktopEnabled = false;
  }

  enableTerminal() {
    this.terminalEnabled = true;
  }

  disableTerminal() {
    this.terminalEnabled = false;
  }
}

module.exports = Notifier;