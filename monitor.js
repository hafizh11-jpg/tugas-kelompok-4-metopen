// ========================================
// monitor.js - Monitoring Engine
// ========================================

const si = require('systeminformation');
const EventEmitter = require('events');

class Monitor extends EventEmitter {
  constructor(alerts) {
    super();
    this.alerts = alerts;
    this.startTime = Date.now();
    
    // Initialize data structure
    this.data = {
      cpu: { 
        currentLoad: 0, 
        cores: [], 
        temperature: 0,
        history: { 
          load: Array(100).fill(0),
          temperature: Array(100).fill(0)
        }
      },
      memory: { 
        total: 0, 
        used: 0, 
        active: 0, 
        available: 0,
        history: { 
          used: Array(100).fill(0),
          available: Array(100).fill(0)
        }
      },
      disk: { 
        total: 0, 
        used: 0, 
        available: 0,
        mount: ''
      },
      network: { 
        rxSec: 0, 
        txSec: 0, 
        rxTotal: 0,
        txTotal: 0,
        iface: 'N/A'
      },
      processes: [],
      system: {
        uptime: 0,
        platform: process.platform,
        arch: process.arch
      },
      alerts: []
    };

    // Network tracking
    this.lastNetworkStats = { rx: 0, tx: 0, time: Date.now() };
    this.isRunning = false;
  }

  async collect() {
    try {
      // Collect all system data in parallel
      const [
        cpuLoad,
        cpuTemp,
        mem,
        disk,
        netStats,
        procs
      ] = await Promise.all([
        si.currentLoad(),
        si.cpuTemperature().catch(() => ({ main: 0 })),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.processes()
      ]);

      // ===== CPU Monitoring =====
      this.data.cpu.currentLoad = cpuLoad.currentLoad;
      this.data.cpu.cores = cpuLoad.cpus || [];
      this.data.cpu.temperature = cpuTemp.main || 0;
      
      // Update CPU history
      this.data.cpu.history.load.push(cpuLoad.currentLoad);
      this.data.cpu.history.temperature.push(cpuTemp.main || 0);
      if (this.data.cpu.history.load.length > 100) this.data.cpu.history.load.shift();
      if (this.data.cpu.history.temperature.length > 100) this.data.cpu.history.temperature.shift();

      // ===== Memory Monitoring =====
      this.data.memory = {
        total: mem.total,
        used: mem.used,
        active: mem.active,
        available: mem.available,
        history: this.data.memory.history
      };
      
      // Update memory history
      this.data.memory.history.used.push(mem.used);
      this.data.memory.history.available.push(mem.available);
      if (this.data.memory.history.used.length > 100) this.data.memory.history.used.shift();
      if (this.data.memory.history.available.length > 100) this.data.memory.history.available.shift();

      // ===== Disk Monitoring =====
      // Find root partition or first available
      const rootDisk = disk.find(d => d.mount === '/') || disk[0] || { size: 0, used: 0, available: 0, mount: 'N/A' };
      this.data.disk = {
        total: rootDisk.size,
        used: rootDisk.used,
        available: rootDisk.available,
        mount: rootDisk.mount
      };

      // ===== Network Monitoring =====
      const activeInterfaces = netStats.filter(n => !n.iface.includes('lo') && n.rx_bytes > 0);
      const primaryIface = activeInterfaces[0] || netStats[0] || { iface: 'N/A', rx_bytes: 0, tx_bytes: 0 };
      
      const now = Date.now();
      const elapsed = (now - this.lastNetworkStats.time) / 1000;
      
      if (elapsed > 0 && this.lastNetworkStats.rx !== 0) {
        this.data.network = {
          rxSec: Math.max(0, (primaryIface.rx_bytes - this.lastNetworkStats.rx) / elapsed),
          txSec: Math.max(0, (primaryIface.tx_bytes - this.lastNetworkStats.tx) / elapsed),
          rxTotal: primaryIface.rx_bytes,
          txTotal: primaryIface.tx_bytes,
          iface: primaryIface.iface
        };
      } else {
        this.data.network.iface = primaryIface.iface;
      }
      
      this.lastNetworkStats = {
        rx: primaryIface.rx_bytes,
        tx: primaryIface.tx_bytes,
        time: now
      };

      // ===== Process Monitoring =====
      this.data.processes = procs.list
        .map(p => ({
          pid: p.pid,
          name: p.name || 'unknown',
          cpu: p.cpu || 0,
          mem: p.mem ? (p.mem / mem.total) * 100 : 0,
          status: p.state || 'unknown'
        }))
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 50);

      // ===== System Info =====
      this.data.system.uptime = process.uptime();
      this.data.system.platform = process.platform;
      this.data.system.arch = process.arch;

      // ===== Alert Checking =====
      this.alerts.checkAll(this.data);
      
    } catch (err) {
      console.error('Monitoring error:', err.message);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Initial collection
    this.collect();
    
    // Continuous monitoring
    this.interval = setInterval(() => this.collect(), 1000);
  }

  stop() {
    if (!this.isRunning) return;
    clearInterval(this.interval);
    this.isRunning = false;
  }

  getCurrentData() {
    return JSON.parse(JSON.stringify(this.data)); // Deep clone
  }

  getAlerts() {
    return [...this.alerts.getActive()];
  }

  getUptime() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}

module.exports = Monitor;