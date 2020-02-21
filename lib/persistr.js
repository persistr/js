const API = require('./API')
const Account = require('./fluent/Account')
const Errors = require('./Errors')
const Identity = require('./utils/identity')
const Local = require('./Local')
const MQ = require('./mq')

class Persistr {
  async account(options) {
    const api = new API(options)
    try {
      const settings = await api.mqSettings()
      if (!settings) console.log('ERROR: Real-time delivery transport not available', error)
      api.messages = MQ.create(settings)
    }
    catch (error) {
      if (error.statusCode !== 401) console.log(error.message)
    }
    return new Account(api)
  }

  async local(options) {
    const api = new Local(options)
    try {
      const settings = await api.mqSettings()
      if (!settings) console.log('ERROR: Real-time delivery transport not available', error)
      api.messages = MQ.create(settings)
      api.store.messages = api.messages
    }
    catch (error) {
      if (error.statusCode !== 401) console.log(error.message)
    }
    return new Account(api)
  }
}

module.exports = { Persistr, persistr: new Persistr(), Identity }

// In browsers, install a global Persistr object.
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
if (isBrowser) {
  global.persistr = module.exports.persistr
}
