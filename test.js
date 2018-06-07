// const log = require('./index')('a', 'b', 'c');
const log = require('./src/index')({override: true});

// log.logLevel = 'ALL';
log.level('debug');
log.debug('Hello World');