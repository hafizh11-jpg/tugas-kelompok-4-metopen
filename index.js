// ========================================
// index.js - Entry Point
// ========================================

const blessed = require('blessed');
const Monitor = require('./monitor');
const UI = require('./ui');
const Notifier = require('./notifier');
const Alerts = require('./alerts');
const Config = require('./config');
const Logger = require('./logger');

// Setup terminal screen
const screen = blessed.screen({
  smartCSR: true,
  title: '🖥️ Server Monitor Pro',
  fullUnicode: true
});

// Keyboard shortcuts
screen.key(['q', 'C-c'], () => {
  logger.info('Aplikasi ditutup oleh user');
  process.exit(0);
});

screen.key(['h', 'H'], () => ui.showHelp());
screen.key(['1'], () => ui.setActiveTab('dashboard'));
screen.key(['2'], () => ui.setActiveTab('processes'));
screen.key(['3'], () => ui.setActiveTab('network'));
screen.key(['4'], () => ui.setActiveTab('alerts'));

// Initialize components
const notifier = new Notifier();
const alerts = new Alerts(Config.thresholds, notifier);
const monitor = new Monitor(alerts);
const ui = new UI(screen, monitor, Config.theme);
const logger = new Logger(Config.logFile);

// Start monitoring
logger.info('Sistem monitoring dimulai');
monitor.start();
ui.render();

// Update UI setiap detik
setInterval(() => ui.update(), Config.refreshInterval);

// Handle exit
process.on('SIGINT', () => {
  logger.info('Aplikasi ditutup (SIGINT)');
  process.exit(0);
});

process.on('exit', () => {
  logger.info('Sistem monitoring berhenti');
});