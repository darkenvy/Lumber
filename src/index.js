function consoleLog(level, args) {
  const maxPriorityInt = this.LEVEL[this.logLevel].priority;
  const incomingPriorityInt = this.LEVEL[level].priority;
  if (incomingPriorityInt > maxPriorityInt) return;
  if (this.LEVEL[level].color === null) return; // safeguard

  const prefix = genPrefix.call(this, level);
  console.log.apply(null, [].concat(prefix, args))
}

function genPrefix(level) {
  const levelMeta = this.LEVEL[level];

  if (this.isBrowser && !this.isIE) { // FF or Chrome
    return [`[ %c${level}%c ]`, `color: ${levelMeta.color.browser}`, 'color: black'];
  } else if (!this.isBrowser && !this.isIE) { // console
    return [`[ ${levelMeta.color.console}${level}\x1b[0m ]`]
  } else { // IE or anything else
    return [`[ ${level} ]`];
  }
}

class Logger {
  static getCookie(sName) {
    const oCrumbles = document.cookie.split(';');
    for(let i=0; i<oCrumbles.length; i++) {
      const oPair = oCrumbles[i].split('=');
      const sKey = decodeURIComponent(oPair[0].trim());
      const sValue = oPair.length >1 ? oPair[1] : '';
      if(sKey == sName) {
        return decodeURIComponent(sValue);
      }
    }
    return '';
  }

  constructor() {
    this.override = false;
    this.isBrowser = typeof window !== 'undefined';
    this.isIE = this.isBrowser && window.navigator && window.navigator.languages === undefined;
    this.LEVEL = {
      NONE: {
        color: null, /* unused solarized color : #859900 */
        priority: 0
      },
      INFO: {
        color: {
          browser: '#268bd2',
          console: '\x1b[32m', // FgGreen
        },
        priority: 1
      },
      WARN: {
        color: {
          browser: '#b58900',
          console: '\x1b[33m', // FgYellow
        },
        priority: 2
      },
      ERROR: {
        color: {
          browser: '#dc322f',
          console: '\x1b[31m', // FgRed
        },
        priority: 3
      },
      FATAL: {
        color: {
          browser: '#d33682',
          console: '\x1b[41m', // BgRed
        },
        priority: 4
      },
      DEBUG: {
        color: {
          browser: '#6c71c4',
          console: '\x1b[35m', // FgMagenta
        },
        priority: 5
      },
      TRACE: {
        color: {
          browser: '#2aa198',
          console: '\x1b[45m', // BgMagenta
        },
        priority: 6
      },
      ALL: {
        color: null,
        priority: 7
      }
    };

    if (arguments.length && arguments[0]) {
      if (typeof arguments[0] === 'boolean') {
        this.override = arguments[0];
      } else if (typeof arguments[0] === 'object' && arguments[0].override) {
        this.override = arguments[0].override;
      }
    }

    // we keep window.loglevel in sync, but this.logLevel is the source of truth.
    if (this.isBrowser) {
      window.logLevel = window.logLevel
        || (this.constructor.getCookie['loglevel'] && this.constructor.getCookie['loglevel'].toUpperCase())
        || 'NONE';
      
      // set logLevel on window if on localhost
      if (window.logLevel === 'NONE' && location.hostname === 'localhost') window.logLevel = 'DEBUG';
    }

    this.logLevel = (this.isBrowser && window.logLevel && this.constructor.LEVEL[window.logLevel]) ? window.logLevel : 'NONE';
    consoleLog.call(this, 'INFO', [`
              Jlogger
      Logging Level ${this.logLevel}
    `]);
    
  }

  level(lvl) {
    let newLevel = lvl;
    if (typeof lvl === 'number') {
      Object.keys(this.LEVEL).forEach(item => {
        if (lvl === this.LEVEL[item].priority) newLevel = item;
      });

      if (lvl > Object.keys(this.LEVEL).length - 1) newLevel = 'ALL';
    } else {
      newLevel = newLevel.toUpperCase();
    }

    if (typeof window !== 'undefined') window.logLevel = this.LEVEL[newLevel] || this.LEVEL.NONE;
    this.logLevel = newLevel || 'NONE';

    if (!this.LEVEL[newLevel]) this.error(`Logger Error: No level '${newLevel}' exists`);
  }

  info(...args) { consoleLog.call(this, 'INFO', args); }
  warn(...args) { consoleLog.call(this, 'WARN', args); }
  error(...args) { consoleLog.call(this, 'ERROR', args); }
  fatal(...args) { consoleLog.call(this, 'FATAL', args); }
  debug(...args) { consoleLog.call(this, 'DEBUG', args); }
  trace(...args) { consoleLog.call(this, 'TRACE', args); }
  all(...args) { consoleLog.call(this, 'ALL', args); }
}

module.exports = Object.assign(function() {
  return new Logger(...arguments);
}, new Logger());
