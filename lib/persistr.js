const API = require('./API')
const Account = require('./fluent/Account')
const Identity = require('./utils/identity')
const MQ = require('./mq')

class Persistr {
  async account(credentials) {
    const api = new API(credentials)
    const settings = await api.mqSettings()
    if (!settings) console.log('ERROR: Real-time delivery transport not available', error)
    api.messages = MQ.create(settings)
    return new Account(api)
  }
}

module.exports = { Persistr, persistr: new Persistr(), Identity }

// In browsers, install a global Persistr object.
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
if (isBrowser) {
  global.persistr = module.exports.persistr
}
