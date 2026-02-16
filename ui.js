// ========================================
// ui.js - User Interface Rendering (FIXED)
// ========================================

const blessed = require('blessed');
const gradient = require('gradient-string');
const figlet = require('figlet');
const formatter = require('./formatter');
const Config = require('./config'); // <-- IMPORT CONFIG DI SINI

class UI {
  constructor(screen, monitor, themeConfig) {
    this.screen = screen;
    this.monitor = monitor;
    this.theme = themeConfig;
    this.activeTab = 'dashboard';
    this.initLayout();
  }

  initLayout() {
    // Header dengan ASCII art
    const headerText = figlet.textSync('SERV MON', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });

    this.header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 6,
      content: gradient.pastel.multiline(headerText),
      tags: true,
      border: { type: 'line' },
      style: { border: { fg: this.theme.accent } }
    });

    // Tab navigation
    this.tabs = blessed.box({
      top: 6,
      left: 0,
      width: '100%',
      height: 3,
      content: `{bold}{#a0a0ff}❶ Dashboard{/}  {#a0ffa0}❷ Processes{/}  {#ffa0a0}❸ Network{/}  {#ffffa0}❹ Alerts{/}  {#a0ffff}❓ Help: [H]{/}`,
      tags: true,
      style: { fg: this.theme.fg, bg: this.theme.bgDark }
    });

    // Main content area
    this.dashboard = blessed.box({
      top: 9,
      left: 0,
      width: '100%',
      height: '70%-9',
      scrollable: true,
      alwaysScroll: true,
      tags: true,
      border: { type: 'line' },
      style: { border: { fg: this.theme.border } }
    });

    // Footer
    this.footer = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      content: `{center}${gradient.atlas('⚡ Real-time Monitoring | Q: Quit | H: Help')}{/}`,
      tags: true,
      style: { bg: this.theme.bgDark, fg: this.theme.fg }
    });

    // Append to screen
    this.screen.append(this.header);
    this.screen.append(this.tabs);
    this.screen.append(this.dashboard);
    this.screen.append(this.footer);
    this.screen.render();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.update();
  }

  update() {
    const data = this.monitor.getCurrentData();
    
    if (this.activeTab === 'dashboard') {
      this.renderDashboard(data);
    } else if (this.activeTab === 'processes') {
      this.renderProcesses(data);
    } else if (this.activeTab === 'network') {
      this.renderNetwork(data);
    } else if (this.activeTab === 'alerts') {
      this.renderAlerts(data);
    }
    
    this.screen.render();
  }

  renderDashboard(data) {
    const { cpu, memory, disk, network, processes } = data;
    const memPercent = (memory.active / memory.total) * 100;
    const diskPercent = (disk.used / disk.total) * 100;

    const content = `
{bold}${this.theme.title}📊 DASHBOARD RESOURCE{/bold}
╔══════════════════════════════════════════════════════════════╗
║ {${this.theme.cpu}}CPU Usage: ${formatter.percent(cpu.currentLoad)} ${this.sparkline(cpu.history.load)}{/} ║
║ {${this.theme.ram}}Memory: ${formatter.percent(memPercent)} (${formatter.bytes(memory.used)} / ${formatter.bytes(memory.total)}) ${this.sparkline(memory.history.used, 15)}{/} ║
║ {${this.theme.disk}}Disk Usage: ${formatter.percent(diskPercent)} (${formatter.bytes(disk.used)} / ${formatter.bytes(disk.total)}){/} ║
║ {${this.theme.net}}Network: ▲ ${formatter.bytes(network.txSec)}/s  ▼ ${formatter.bytes(network.rxSec)}/s  (${network.iface}){/} ║
╚══════════════════════════════════════════════════════════════╝

{bold}${this.theme.title}mPid Active Processes (Top 10){/bold}
╔═══════╦══════════════════════╦══════╦══════╦════════╗
║ {${this.theme.process}}PID  {/}║ {${this.theme.process}}Name            {/}║{${this.theme.cpu}} CPU%{/}║{${this.theme.ram}} MEM%{/}║ Status ║
╠═══════╬══════════════════════╬══════╬══════╬════════╣
${processes.slice(0, 10).map((p, i) => {
  const rowColor = i % 2 === 0 ? '' : `{${this.theme.bgDark}}`;
  return `${rowColor}║ ${p.pid.toString().padEnd(5)} ║ ${p.name.padEnd(20).slice(0, 20)} ║ ${p.cpu.toFixed(1).padStart(4)} ║ ${p.mem.toFixed(1).padStart(4)} ║ ${p.status.padEnd(6)} ║{/}`;
}).join('\n')}
╚═══════╩══════════════════════╩══════╩══════╩════════╝

{bold}${this.theme.title}📈 System Stats{/bold}
• Uptime: ${formatter.uptime(process.uptime())}
• Platform: ${process.platform} (${process.arch})
• Node.js: ${process.version}
• Monitoring Interval: ${Config.refreshInterval}ms

{bold}${this.theme.title}⚠️  Active Alerts (Last 5){/bold}
${this.monitor.getAlerts().length > 0 
  ? this.monitor.getAlerts().slice(-5).map((a, i) => {
      const levelTag = a.level === 'critical' ? `{${this.theme.critical}}` : `{${this.theme.warning}}`;
      return `${levelTag}• [${a.level.toUpperCase()}]{/} ${a.message} {gray}(${a.timestamp}){/}`;
    }).join('\n')
  : 'No active alerts - System running smoothly ✅'}
    `.trim();

    this.dashboard.setContent(content);
  }

  renderProcesses(data) {
    const processes = data.processes.sort((a, b) => b.mem - a.mem);

    const content = `
{bold}${this.theme.title}mPid Process List (Sorted by Memory){/bold}
Total Processes: ${processes.length}

╔═══════╦══════════════════════╦══════════════╦══════════════╦════════╗
║ PID   ║ Name                 ║ Memory       ║ CPU          ║ Status ║
╠═══════╬══════════════════════╬══════════════╬══════════════╬════════╣
${processes.slice(0, 30).map((p, i) => {
  const rowColor = i % 2 === 0 ? '' : `{${this.theme.bgDark}}`;
  return `${rowColor}║ ${p.pid.toString().padEnd(5)} ║ ${p.name.padEnd(20).slice(0, 20)} ║ ${formatter.bytes(p.mem * data.memory.total / 100).padEnd(12)} ║ ${p.cpu.toFixed(1)}%${' '.repeat(8)} ║ ${p.status.padEnd(6)} ║{/}`;
}).join('\n')}
╚═══════╩══════════════════════╩══════════════╩══════════════╩════════╝

{gray}Press [1] to return to Dashboard{/}
    `.trim();

    this.dashboard.setContent(content);
  }

  renderNetwork(data) {
    const content = `
{bold}${this.theme.title}🌐 Network Statistics{/bold}

{${this.theme.net}}Interface:{/} ${data.network.iface}
{${this.theme.net}}Upload Speed:{/} ${formatter.bytes(data.network.txSec)}/s
{${this.theme.net}}Download Speed:{/} ${formatter.bytes(data.network.rxSec)}/s
{${this.theme.net}}Total Upload:{/} ${formatter.bytes(data.network.txTotal || 0)}
{${this.theme.net}}Total Download:{/} ${formatter.bytes(data.network.rxTotal || 0)}

{bold}${this.theme.title}📊 Real-time Bandwidth{/bold}
Upload:   {${this.theme.net}}${'█'.repeat(Math.min(50, Math.floor(data.network.txSec / 1024 / 10)))}{/} ${formatter.bytes(data.network.txSec)}/s
Download: {${this.theme.net}}${'█'.repeat(Math.min(50, Math.floor(data.network.rxSec / 1024 / 10)))}{/} ${formatter.bytes(data.network.rxSec)}/s

{gray}Press [1] to return to Dashboard{/}
    `.trim();

    this.dashboard.setContent(content);
  }

  renderAlerts(data) {
    const alerts = this.monitor.getAlerts();

    const content = `
{bold}${this.theme.title}🔔 Alert History{/bold}

Total Alerts: ${alerts.length}

${alerts.length > 0 
  ? alerts.slice(-20).reverse().map(a => {
      const time = a.timestamp;
      const levelTag = a.level === 'critical' ? `{${this.theme.critical}}` : `{${this.theme.warning}}`;
      const icon = a.level === 'critical' ? '🔴' : '🟡';
      return `${levelTag}${icon} [${time}] [${a.level.toUpperCase()}]{/} ${a.message}`;
    }).join('\n')
  : 'No alerts recorded yet. System is healthy! 🎉'}

{gray}Press [1] to return to Dashboard{/}
    `.trim();

    this.dashboard.setContent(content);
  }

  // Internal sparkline generator
  sparkline(data, width = 20) {
    if (!data || data.length === 0) return '';
    
    const values = data.slice(-width);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return values.map(v => {
      const normalized = Math.floor(((v - min) / range) * 8);
      return ' ▁▂▃▄▅▆▇█'[Math.max(0, Math.min(8, normalized))];
    }).join('');
  }

  showHelp() {
    const helpBox = blessed.box({
      top: 'center',
      left: 'center',
      width: 70,
      height: 18,
      content: `{bold}⌨️  KEYBOARD SHORTCUTS{/}\n\n` +
               `{#a0a0ff}Q / Ctrl+C{/} : Quit application\n` +
               `{#a0a0ff}H{/}          : Show this help\n` +
               `{#a0a0ff}1{/}          : Dashboard view\n` +
               `{#a0ffa0}2{/}          : Processes view\n` +
               `{#ffa0a0}3{/}          : Network view\n` +
               `{#ffffa0}4{/}          : Alerts history\n\n` +
               `{gray}Use ↑/↓ to scroll in lists{/}`,
      tags: true,
      border: { type: 'line' },
      style: { 
        border: { fg: this.theme.accent },
        bg: this.theme.bgDark,
        fg: this.theme.fg
      }
    });

    this.screen.append(helpBox);
    this.screen.render();

    // Auto close after 5 seconds
    setTimeout(() => {
      helpBox.destroy();
      this.screen.render();
    }, 5000);
  }

  render() {
    this.screen.render();
  }
}

module.exports = UI;