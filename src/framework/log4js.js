/* eslint-disable import/no-mutable-exports,func-names,object-shorthand,eol-last */
const log4js = require('log4js')
const path = require('path')

// log4js init
log4js.configure(path.join(process.cwd(), 'config', 'log4js.json'))

export const logger = log4js.getLogger()

export let loggerDebug

if (process.env.NODE_ENV === 'development') {
  loggerDebug = log4js.getLogger('debug')
} else {
  loggerDebug = {
    all: function () {
    },
    trace: function () {
    },
    debug: function () {
    },
    info: function () {
    },
    warn: function () {
    },
    error: function () {
    },
    fatal: function () {
    },
    mark: function () {
    }
  }
}
global.logger = logger
global.logger_debug = loggerDebug
