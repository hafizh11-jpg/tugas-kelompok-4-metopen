// ========================================
// alerts.js - Alert Management System
// ========================================

class Alerts {
  constructor(thresholds, notifier) {
    this.thresholds = thresholds;
    this.notifier = notifier;
    this.activeAlerts = [];
    this.alertHistory = [];
    this.lastCpuAlert = 0;
    this.lastMemAlert = 0;
    this.lastDiskAlert = 0;
    this.alertCooldown = 30000; // 30 seconds cooldown
  }

  checkAll(data) {
    const now = Date.now();
    const timestamp = new Date().toLocaleTimeString();

    // CPU Alert Check
    this.checkCpuAlert(data.cpu, timestamp, now);
    
    // Memory Alert Check
    this.checkMemoryAlert(data.memory, timestamp, now);
    
    // Disk Alert Check
    this.checkDiskAlert(data.disk, timestamp, now);
    
    // Temperature Alert Check
    this.checkTemperatureAlert(data.cpu, timestamp, now);
    
    // Network Alert Check
    this.checkNetworkAlert(data.network, timestamp, now);
  }

  checkCpuAlert(cpu, timestamp, now) {
    const load = cpu.currentLoad;
    
    if (load > this.thresholds.cpu.critical && now - this.lastCpuAlert > this.alertCooldown) {
      this.trigger('critical', 'CPU', `CPU load critical: ${load.toFixed(1)}%`, timestamp);
      this.lastCpuAlert = now;
    } else if (load > this.thresholds.cpu.warning && now - this.lastCpuAlert > this.alertCooldown) {
      this.trigger('warning', 'CPU', `CPU load high: ${load.toFixed(1)}%`, timestamp);
      this.lastCpuAlert = now;
    }
  }

  checkMemoryAlert(memory, timestamp, now) {
    const memPercent = (memory.active / memory.total) * 100;
    
    if (memPercent > this.thresholds.memory.critical && now - this.lastMemAlert > this.alertCooldown) {
      this.trigger('critical', 'Memory', `Memory usage critical: ${memPercent.toFixed(1)}% (${this.formatBytes(memory.used)})`, timestamp);
      this.lastMemAlert = now;
    } else if (memPercent > this.thresholds.memory.warning && now - this.lastMemAlert > this.alertCooldown) {
      this.trigger('warning', 'Memory', `Memory usage high: ${memPercent.toFixed(1)}%`, timestamp);
      this.lastMemAlert = now;
    }
  }

  checkDiskAlert(disk, timestamp, now) {
    const diskPercent = (disk.used / disk.total) * 100;
    
    if (diskPercent > this.thresholds.disk.critical && now - this.lastDiskAlert > this.alertCooldown) {
      this.trigger('critical', 'Disk', `Disk usage critical: ${diskPercent.toFixed(1)}% (${this.formatBytes(disk.used)} / ${this.formatBytes(disk.total)})`, timestamp);
      this.lastDiskAlert = now;
    } else if (diskPercent > this.thresholds.disk.warning && now - this.lastDiskAlert > this.alertCooldown) {
      this.trigger('warning', 'Disk', `Disk usage high: ${diskPercent.toFixed(1)}%`, timestamp);
      this.lastDiskAlert = now;
    }
  }

  checkTemperatureAlert(cpu, timestamp, now) {
    const temp = cpu.temperature;
    
    if (temp > this.thresholds.temperature.critical) {
      this.trigger('critical', 'Temperature', `CPU temperature critical: ${temp.toFixed(1)}°C`, timestamp);
    } else if (temp > this.thresholds.temperature.warning) {
      this.trigger('warning', 'Temperature', `CPU temperature high: ${temp.toFixed(1)}°C`, timestamp);
    }
  }

  checkNetworkAlert(network, timestamp, now) {
    const totalSpeed = network.rxSec + network.txSec;
    
    if (totalSpeed > this.thresholds.network.critical) {
      this.trigger('warning', 'Network', `High network activity: ${this.formatBytes(totalSpeed)}/s`, timestamp);
    }
  }

  trigger(level, resource, message, timestamp) {
    const alert = {
      id: Date.now(),
      level,
      resource,
      message,
      timestamp,
      acknowledged: false
    };

    // Add to active alerts
    this.activeAlerts.push(alert);
    
    // Add to history
    this.alertHistory.push(alert);
    
    // Keep history limited
    if (this.alertHistory.length > 1000) {
      this.alertHistory.shift();
    }

    // Send notification
    this.notifier.send(`${resource} ${level.toUpperCase()}`, message, level);
  }

  acknowledgeAlert(alertId) {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  clearResolved() {
    const now = Date.now();
    this.activeAlerts = this.activeAlerts.filter(alert => {
      // Keep critical alerts until acknowledged
      if (alert.level === 'critical' && !alert.acknowledged) {
        return true;
      }
      // Auto-clear after 2 minutes
      return now - alert.id < 120000;
    });
  }

  getActive() {
    return [...this.activeAlerts];
  }

  getHistory(limit = 50) {
    return [...this.alertHistory].slice(-limit).reverse();
  }

  getStats() {
    return {
      total: this.alertHistory.length,
      active: this.activeAlerts.length,
      critical: this.activeAlerts.filter(a => a.level === 'critical').length,
      warning: this.activeAlerts.filter(a => a.level === 'warning').length
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

module.exports = Alerts;