const API = require('./API')
const Connection = require('./fluent/Connection')
const Database = require('./fluent/Database')
const Errors = require('./Errors')
const Identity = require('./utils/identity')
const Local = require('./Local')
const { ConnectionStringParser } = require('connection-string-parser')

class Persistr {
  async connect(options) {
    // Parse connection string.
    if (Object.prototype.toString.call(options) === "[object String]") {
      const cxn = connectionStringParser.parse(options)
      cxn.host = { name: cxn.hosts?.[0]?.host, port: cxn.hosts?.[0]?.port }
      cxn.host = cxn.host || {}
      const scheme = `http${cxn.options.tls === undefined || cxn.options.tls === 'true' ? 's' : ''}`
      options = {
        server: `${scheme}://${cxn.host.name}${cxn.host.port ? ':' + cxn.host.port : ''}`,
        database: cxn.endpoint,
        credentials: {
          apikey: cxn.options.apikey,
          email: cxn.username,
          password: cxn.password
        }
      }
    }

    // Establish a connection.
    let connection
    if (options.server === null) {
      connection = openLocal(options)
    }
    else if (options.server) {
      connection = openServer(options, options.server)
    }
    else {
      const environment = options && options.environment ? `-${options.environment}` : ''
      connection = openServer(options, `https://api${environment}.persistr.com`)
    }

    // Return either the default database, if given, or the connection
    if (options.database) connection.db = new Database(options.database, connection)
    return connection
  }
}

const connectionStringParser = new ConnectionStringParser({
  scheme: "persistr",
  hosts: []
})

function openServer(options, url) {
  const api = new API(options, url)
  return new Connection(api, options.database)
}

function openLocal(options) {
  const api = new Local(options)
  return new Connection(api, options.database)
}

module.exports = { Persistr, persistr: new Persistr(), Identity }

// In browsers, install a global Persistr object.
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
if (isBrowser) {
  global.persistr = module.exports.persistr
}
