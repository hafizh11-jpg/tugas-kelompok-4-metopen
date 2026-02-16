// ========================================
// config.js - Application Configuration
// ========================================

const theme = require('./theme');

module.exports = {
  // Alert thresholds (percentage)
  thresholds: {
    cpu: {
      warning: 70,
      critical: 90
    },
    memory: {
      warning: 75,
      critical: 90
    },
    disk: {
      warning: 80,
      critical: 95
    },
    temperature: {
      warning: 75,
      critical: 90
    },
    network: {
      warning: 50 * 1024 * 1024,    // 50 MB/s
      critical: 100 * 1024 * 1024   // 100 MB/s
    }
  },

  // UI Configuration
  theme: theme.default,
  refreshInterval: 1000,  // ms
  historyLength: 100,

  // Logging
  logFile: './monitor.log',
  logLevel: 'info',  // debug, info, warn, error

  // Features
  enableDesktopNotifications: true,
  enableTerminalNotifications: true,
  autoClearAlerts: true
};