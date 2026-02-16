// ========================================
// theme.js - Color Themes (Blessed-Compatible)
// ========================================

// Default Theme (Dark Purple/Cyan) - Using blessed color tags
const defaultTheme = {
  // Base colors (hex codes for blessed {#RRGGBB} syntax)
  bg: '#1e1f29',
  bgDark: '#161722',
  fg: '#cdd6f4',
  fgDim: '#9399b2',
  
  // Borders & accents
  border: '#585b70',
  accent: '#b4befe',
  
  // Resource colors (as blessed tag strings)
  cpu: '#f38ba8',      // Red/Pink
  ram: '#fab387',      // Orange
  disk: '#f9e2af',     // Yellow
  net: '#a6e3a1',      // Green
  process: '#89b4fa',  // Blue
  temp: '#cba6f7',     // Purple
  
  // Text styles (as blessed tags)
  title: '{#cba6f7}{bold}',
  
  // Alert colors
  warning: '#f9e2af',
  critical: '#f38ba8',
  
  // Status colors
  statusRunning: '#a6e3a1',
  statusStopped: '#f38ba8',
  statusWarning: '#f9e2af'
};

// Cyberpunk Theme (Neon Green/Purple)
const cyberpunkTheme = {
  bg: '#0a0a0f',
  bgDark: '#05050a',
  fg: '#00ffaa',
  fgDim: '#00cc88',
  border: '#4dffcc',
  accent: '#ff00ff',
  cpu: '#ff00ff',
  ram: '#ff4d4d',
  disk: '#ffcc00',
  net: '#00ffcc',
  process: '#ff66ff',
  temp: '#ff3399',
  title: '{#ff00ff}{bold}',
  warning: '#ffcc00',
  critical: '#ff0066',
  statusRunning: '#00ff66',
  statusStopped: '#ff0066',
  statusWarning: '#ffcc00'
};

// Solarized Dark Theme
const solarizedDarkTheme = {
  bg: '#002b36',
  bgDark: '#073642',
  fg: '#839496',
  fgDim: '#586e75',
  border: '#657b83',
  accent: '#268bd2',
  cpu: '#dc322f',
  ram: '#cb4b16',
  disk: '#b58900',
  net: '#859900',
  process: '#268bd2',
  temp: '#d33682',
  title: '{#268bd2}{bold}',
  warning: '#b58900',
  critical: '#dc322f',
  statusRunning: '#859900',
  statusStopped: '#dc322f',
  statusWarning: '#b58900'
};

module.exports = {
  default: defaultTheme,
  cyberpunk: cyberpunkTheme,
  solarized: solarizedDarkTheme,
  
  // Get theme by name
  get: (name) => {
    return module.exports[name] || module.exports.default;
  },
  
  // List all available themes
  list: () => {
    return ['default', 'cyberpunk', 'solarized'];
  }
};