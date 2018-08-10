import cookie from 'react-cookies';

class Logger {
  static genPrefix(logType, logColor, isIE) {
    return isIE
      ? [`[ ${logType} ]`]
      : [`[ %c${logType}%c ]`, `color: ${logColor}`, 'color: black'];
  }

  constructor() {
    // Colors are "Solarized" theme.
    this.isIE = window.navigator.languages === undefined;
    this.solarizedColors = {
      base03: '#002b36',
      base02: '#073642',
      base01: '#586e75',
      base00: '#657b83',
      base0: '#839496',
      base1: '#93a1a1',
      base2: '#eee8d5',
      base3: '#fdf6e3',
      yellow: '#b58900',
      orange: '#cb4b16',
      red: '#dc322f',
      magenta: '#d33682',
      violet: '#6c71c4',
      blue: '#268bd2',
      cyan: '#2aa198',
      green: '#859900',
    };

    this.colors = {
      Info: this.solarizedColors.blue,
      Warn: this.solarizedColors.yellow,
      Error: this.solarizedColors.red,
      Debug: this.solarizedColors.violet,
    };

    this.LEVEL = {
      NONE: 'None',
      INFO: 'Info',
      WARN: 'Warn',
      ERROR: 'Error',
      DEBUG: 'Debug',
    };

    this.priority = {
      NONE: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      DEBUG: 4,
    };

    const allCookies = cookie.loadAll();
    if (window) {
      window.logLevel = window.logLevel
        || allCookies.loglevel
        || (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('loglevel'))
        || window.location.hostname === 'localhost' ? this.LEVEL.DEBUG : this.LEVEL.NONE;
    }
    this.logLevel = (window && window.logLevel && this.LEVEL[window.logLevel.toUpperCase()]) || this.LEVEL.NONE;

    this.consoleLog(this.LEVEL.INFO, [`
      Logging Level ${this.logLevel}
    `]);
  }

  consoleLog(level, args) {
    const maxPriority = this.priority[this.logLevel.toUpperCase()];
    const incomingPriority = this.priority[level.toUpperCase()];
    if (incomingPriority > maxPriority) return;

    const prefix = this.constructor.genPrefix(level, this.colors[level] || 'black', this.isIE);
    console.log(...prefix, ...args); // eslint-disable-line no-console
  }

  updateLogLevel(level) {
    if (window) window.logLevel = this.LEVEL[level] || this.LEVEL.NONE;
    this.logLevel = this.LEVEL[level] || this.LEVEL.NONE;
  }

  info(...args) { this.consoleLog(this.LEVEL.INFO, args); }
  warn(...args) { this.consoleLog(this.LEVEL.WARN, args); }
  error(...args) { this.consoleLog(this.LEVEL.ERROR, args); }
  // fatal(...args) { this.consoleLog(this.LEVEL.FATAL, args); }
  debug(...args) { this.consoleLog(this.LEVEL.DEBUG, args); }
  // trace(...args) { this.consoleLog(this.LEVEL.TRACE, args); }
  // all(...args) { this.consoleLog(this.LEVEL.ALL, args); }
}

export default new Logger();
