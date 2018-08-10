# Lumber
The go-to Javascript logging tool

### Why?
Stop exporting console logs to the end user! Hide those console logs while still being helpful to debugging & development. This is where Lumber comes in.

### How to use
```
import log from 'lumber'
log.info('Hello World');
```
or
```
const log = require('lumber');
log.info('Hello', 'world');
```