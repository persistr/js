module.exports = class ConnectionRefused extends require('./PersistrError') {
  constructor (server) {
    super(`Connection refused while attempting to connect to Persistr Server${server ? ' at ' + server : ''}`)
  }
}
