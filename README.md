## 📄 Aplikasi Sistem Monitoring Resource Server Berbasis CLI dengan Notifikasi Real-Time

```markdown
# 🖥️ Server Monitor Pro

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v25+-green.svg)](https://nodejs.org/)
[![CLI](https://img.shields.io/badge/CLI-Terminal-purple.svg)](https://en.wikipedia.org/wiki/Command-line_interface)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com)

**Sistem Monitoring Resource Server Berbasis CLI dengan Notifikasi Real-Time**

Terminal-based server monitoring tool dengan UI cantik, fitur lengkap, dan notifikasi instan!

---

[✨ Fitur](#-fitur) • [🚀 Instalasi](#-instalasi) • [🎮 Penggunaan](#-penggunaan) • [📸 Screenshots](#-screenshots) • [🔧 Konfigurasi](#-konfigurasi)

</div>

---

## ✨ Fitur

### 📊 Monitoring Real-Time
- **CPU Monitoring**: Load percentage, per-core usage, temperature monitoring
- **Memory Monitoring**: RAM usage (active/total), available memory tracking
- **Disk Monitoring**: Storage usage dengan mount point detection
- **Network Monitoring**: Upload/download speed, total bandwidth, interface detection
- **Process Monitoring**: Top 50 processes sorted by CPU/Memory usage

### 🎨 User Interface
- **ASCII Art Header**: Branding dengan gradient colors
- **Sparkline Charts**: Visualisasi real-time untuk CPU & Memory
- **Color-Coded Metrics**: Warna berbeda untuk setiap resource type
- **Tab Navigation**: 4 view modes (Dashboard, Processes, Network, Alerts)
- **Responsive Layout**: Auto-adjust untuk berbagai ukuran terminal

### 🔔 Notifikasi Sistem
- **Terminal Notifications**: ANSI-colored alerts di console
- **Desktop Notifications**: Popup notifications untuk critical alerts
- **Smart Alerting**: Threshold-based dengan cooldown system
- **Alert History**: Log lengkap dengan timestamp

### ⚙️ Alert Management
- **Customizable Thresholds**: Warning & critical levels untuk CPU, Memory, Disk, Temperature
- **Auto-Resolve**: Alerts otomatis clear setelah kondisi normal
- **Critical Alert Persistence**: Critical alerts tetap muncul sampai acknowledged
- **Multi-Level Alerts**: Info, Warning, Critical dengan severity berbeda

### 📝 Logging System
- **Timestamped Logs**: Semua event tercatat dengan ISO timestamp
- **Color-Coded Logs**: Debug, Info, Warning, Error dengan warna berbeda
- **File Logging**: Log tersimpan di `monitor.log` untuk analisis
- **Log Statistics**: View log size, line count, last modified

### 🎯 Additional Features
- **Keyboard Shortcuts**: Navigasi cepat dengan hotkeys
- **Help Screen**: Quick reference untuk semua shortcuts
- **Uptime Tracking**: System uptime monitoring
- **Cross-Platform**: Kompatibel dengan Linux, macOS, Windows (WSL)
- **Zero Dependencies Issues**: 100% CommonJS, no ESM conflicts

---

## 🚀 Instalasi

### Prerequisites
- **Node.js** v14+ (direkomendasikan v25+)
- **npm** atau **yarn**
- Terminal dengan full Unicode support

### Langkah Instalasi

```bash
# 1. Clone atau buat folder proyek
mkdir server-monitor && cd server-monitor

# 2. Inisialisasi Node.js project
npm init -y

# 3. Install dependencies
npm install blessed systeminformation node-notifier gradient-string figures figlet

# 4. Buat 9 file JavaScript (lihat struktur di bawah)
# Atau copy-paste dari source code yang sudah disediakan

# 5. Verifikasi instalasi
ls -1 *.js
# Harus muncul 9 file:
# alerts.js  config.js  formatter.js  index.js  logger.js
# monitor.js notifier.js theme.js      ui.js
```

### Struktur File
```
server-monitor/
├── index.js          # Entry point aplikasi
├── ui.js             # User Interface rendering
├── monitor.js        # Monitoring engine
├── notifier.js       # Notification system
├── alerts.js         # Alert management
├── config.js         # Konfigurasi thresholds & tema
├── logger.js         # Logging system
├── formatter.js      # Data formatting helpers
├── theme.js          # Color themes
└── package.json      # Dependencies & metadata
```

---

## 🎮 Penggunaan

### Menjalankan Aplikasi

```bash
# Start monitoring
node index.js

# Atau menggunakan npm script
npm start
```

### Keyboard Shortcuts

| Shortcut | Fungsi | Deskripsi |
|----------|--------|-----------|
| `Q` / `Ctrl+C` | Quit | Keluar dari aplikasi |
| `H` | Help | Tampilkan help screen |
| `1` | Dashboard | View monitoring dashboard |
| `2` | Processes | View process list |
| `3` | Network | View network statistics |
| `4` | Alerts | View alert history |
| `↑` / `↓` | Scroll | Scroll list items |

### Navigasi Tab

#### 📊 Dashboard (Tab 1)
- **Overview**: Ringkasan semua resource
- **Sparklines**: Grafik real-time CPU & Memory
- **Top Processes**: 10 proses dengan CPU tertinggi
- **System Stats**: Uptime, platform, Node.js version
- **Active Alerts**: 5 alert terakhir

#### 👥 Processes (Tab 2)
- **Process List**: 30 proses teratas
- **Sort by Memory**: Default sorted by memory usage
- **Detailed Info**: PID, Name, Memory, CPU, Status
- **Color-Coded Rows**: Alternating row colors untuk readability

#### 🌐 Network (Tab 3)
- **Interface Info**: Network interface name
- **Speed Metrics**: Upload & download speed real-time
- **Total Bandwidth**: Cumulative data transfer
- **Visual Bandwidth**: Progress bar untuk speed visualization

#### 🔔 Alerts (Tab 4)
- **Alert History**: 20 alert terakhir (reverse chronological)
- **Severity Indicators**: Icons & colors untuk severity
- **Timestamps**: Waktu exact setiap alert triggered
- **Total Count**: Summary jumlah alerts

---

## 📸 Screenshots

### Dashboard View
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ██████╗███████╗██████╗ ██╗   ██╗██╗████████╗██╗   ██╗    ┃
┃  ██╔════╝██╔════╝██╔══██╗██║   ██║██║╚══██╔══╝╚██╗ ██╔╝    ┃
┃  ╚█████╗ ███████╗██████╔╝██║   ██║██║   ██║    ╚████╔╝     ┃
┃   ╚═══██╗╚════██║██╔═══╝ ██║   ██║██║   ██║     ╚██╔╝      ┃
┃  ██████╔╝███████║██║     ╚██████╔╝██║   ██║      ██║       ┃
┃  ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝   ╚═╝      ╚═╝       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
❶ Dashboard  ❷ Processes  ❸ Network  ❹ Alerts  ❓ Help: [H]

╔══════════════════════════════════════════════════════════════╗
║ CPU Usage: 24.5% ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇                     ║
║ Memory: 42.3% (6.70 GiB / 15.60 GiB) ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁      ║
║ Disk Usage: 68.2% (341.00 GiB / 500.00 GiB)                ║
║ Network: ▲ 1.20 MiB/s  ▼ 845.30 KiB/s  (eth0)              ║
╚══════════════════════════════════════════════════════════════╝

╔═══════╦══════════════════════╦══════╦══════╦════════╗
║ PID   ║ Name                 ║ CPU% ║ MEM% ║ Status ║
╠═══════╬══════════════════════╬══════╬══════╬════════╣
║ 1234  ║ node                 ║ 24.5 ║ 42.3 ║ S      ║
║ 5678  ║ chrome               ║ 15.2 ║ 28.7 ║ S      ║
║ 9012  ║ vscode               ║  8.3 ║ 18.9 ║ S      ║
╚═══════╩══════════════════════╩══════╩══════╩════════╝
```

### Alert Notification Example
```
🔴 [14:30:45] CPU CRITICAL: CPU load critical: 95.3%
🟡 [14:28:12] Memory WARNING: Memory usage high: 85.7%
```

---

## 🔧 Konfigurasi

### File `config.js`

```javascript
module.exports = {
  // Alert thresholds (percentage)
  thresholds: {
    cpu: {
      warning: 70,      // Warning di 70%
      critical: 90      // Critical di 90%
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
      warning: 75,      // °C
      critical: 90
    },
    network: {
      warning: 50 * 1024 * 1024,    // 50 MB/s
      critical: 100 * 1024 * 1024   // 100 MB/s
    }
  },

  // UI Configuration
  theme: theme.default,        // 'default', 'cyberpunk', 'solarized'
  refreshInterval: 1000,       // Update interval (ms)
  historyLength: 100,          // Data points untuk sparkline

  // Logging
  logFile: './monitor.log',
  logLevel: 'info',            // 'debug', 'info', 'warn', 'error'

  // Features
  enableDesktopNotifications: true,
  enableTerminalNotifications: true,
  autoClearAlerts: true
};
```

### Mengganti Theme

Edit `config.js` dan ganti theme:

```javascript
// Pilih salah satu:
theme: theme.default,      // Dark Purple/Cyan (default)
theme: theme.cyberpunk,    // Neon Green/Purple
theme: theme.solarized     // Solarized Dark
```

### Custom Thresholds

Sesuaikan thresholds sesuai kebutuhan server Anda:

```javascript
thresholds: {
  cpu: {
    warning: 60,      // Lebih sensitif
    critical: 85
  },
  memory: {
    warning: 70,
    critical: 85
  }
}
```

---

## 🐛 Troubleshooting

### Error: `chalk.hex is not a function`
**Solusi**: Pastikan tidak ada dependency `chalk` yang terinstall. Hapus dengan:
```bash
npm uninstall chalk
```

### Error: `prettyBytes is not a function`
**Solusi**: Pastikan menggunakan `formatter.js` versi terbaru (tanpa dependency `pretty-bytes`).

### Terminal tidak support Unicode
**Solusi**: Gunakan terminal modern seperti:
- **Linux**: GNOME Terminal, Konsole, Alacritty
- **macOS**: iTerm2, Terminal.app
- **Windows**: Windows Terminal, WSL

### Desktop notifications tidak muncul
**Solusi**: 
- Linux: Install `libnotify-bin`
- macOS: Izinkan notifikasi di System Preferences
- Windows: Enable notifications di Settings

---

## 📊 Technical Details

### Architecture
- **Pattern**: Modular dengan separation of concerns
- **Event-Driven**: Menggunakan EventEmitter untuk alert system
- **Async/Await**: Promise-based untuk non-blocking I/O
- **Singleton Pattern**: Single instance untuk monitor & logger

### Data Flow
```
systeminformation → monitor.js → alerts.js → notifier.js
                                     ↓
                                 ui.js ← data
                                     ↓
                              blessed (rendering)
```

### Performance
- **Update Interval**: 1 second (configurable)
- **Memory Usage**: ~50-100 MB (tergantung processes)
- **CPU Overhead**: < 1% (minimal impact)

---

## 📝 License

MIT License - Feel free to use, modify, and distribute!

---

## 👨‍💻 Developer

**Hafizh**  
Student - Informatics Engineering  
Bandung, Indonesia

📧 Email: hafizhnezuko@gmail.com  
💻 OS: Bazzite Linux  
⌨️ Editor: GNU nano

---

## 🙏 Credits

- **blessed**: Terminal UI library
- **systeminformation**: System monitoring data
- **node-notifier**: Desktop notifications
- **gradient-string**: Beautiful gradient text
- **figlet**: ASCII art text generation

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek dokumentasi di atas
2. Review source code comments
3. Test dengan konfigurasi default terlebih dahulu

---

<div align="center">

**Happy Monitoring! 🚀**

⭐ Star this project if you find it useful!

</div>
```

---
