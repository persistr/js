const API = require('./API')
const Connection = require('./fluent/Connection')
const Database = require('./fluent/Database')
const Errors = require('./Errors')
const Identity = require('./utils/identity')
const { Store } = require('@persistr/store')

class Persistr {
  constructor() {
  }

  async connect(options, store) {
    if (!options && !store) {
      options = 'sqlite3:memory'
    }

    if (store === undefined && Object.prototype.toString.call(options) !== "[object String]") {
      store = options
      options = {}
    }

    if (Object.prototype.toString.call(options) !== "[object String]") {
      const parsed = new URL(options)
      options = {
        protocol: parsed.protocol.replace(':', ''),
        hostname: parsed.hostname,
        port: parsed.port,
        username: parsed.username,
        password: parsed.password,
        database: parsed.pathname
      }
    }

    if (!store && options.protocol !== 'persistr') {
      store = new Store(options)
    }

    const connection = new Connection(await store.connect())

    if (options.protocol === 'persistr') {
      if (!options.authorization && !options.authorized) {
        options.authorization = () => connection.authorization
        options.authorized = authorization => connection.authorization = authorization
      }
    }

    // Return either the default database, if given, or the connection.
/*
    if (options.database) connection.db = new Database(options.database, connection)
    if (options.server === null) connection.db = new Database('default', connection)
*/

    return connection
  }
}

module.exports = { Persistr, persistr: new Persistr(), Identity }

// In browsers, install a global Persistr object.
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
if (isBrowser) {
  global.persistr = module.exports.persistr
}
