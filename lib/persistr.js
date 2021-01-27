const API = require('./API')
const Account = require('./fluent/Account')
const Errors = require('./Errors')
const Identity = require('./utils/identity')
const Local = require('./Local')

class Persistr {
  async connect(options) {
    if (options.server === null) {
      return local(options)
    }
    else if (options.server) {
      return account(options, options.server)
    }
    else {
      const environment = options && options.environment ? `-${options.environment}` : ''
      return account(options, `https://api${environment}.persistr.com`)
    }
  }
}

async function account(options, url) {
  const api = new API(options, url)
  return new Account(api)
}

async function local(options) {
  const api = new Local(options)
  return new Account(api)
}

module.exports = { Persistr, persistr: new Persistr(), Identity }

// In browsers, install a global Persistr object.
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
if (isBrowser) {
  global.persistr = module.exports.persistr
}
