// ========================================
// formatter.js - Data Formatting Helpers (100% Native)
// ========================================

module.exports = {
  // Format bytes to human readable (manual implementation)
  bytes: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0 B';
    if (num === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return `${parseFloat((num / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  // Format percentage
  percent: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0.0%';
    return `${num.toFixed(1)}%`;
  },

  // Format uptime in human readable format
  uptime: (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '0s';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  },

  // Format temperature
  temperature: (celsius) => {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return 'N/A';
    return `${celsius.toFixed(1)}°C`;
  },

  // Format frequency
  frequency: (mhz) => {
    if (mhz === null || mhz === undefined || isNaN(mhz)) return 'N/A';
    return `${(mhz / 1000).toFixed(2)} GHz`;
  },

  // Format number with commas
  number: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toLocaleString('en-US');
  },

  // Format date/time
  datetime: (date = new Date()) => {
    return date.toLocaleString('en-US');
  },

  // Format duration in milliseconds
  duration: (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  },

  // Format data rate (bytes per second)
  datarate: (bytesPerSec) => {
    return `${this.bytes(bytesPerSec)}/s`;
  },

  // Truncate string
  truncate: (str, length = 20) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length - 3) + '...' : str;
  },

  // Pad string
  pad: (str, length, char = ' ') => {
    if (!str) str = '';
    return str.toString().padEnd(length, char);
  }
};