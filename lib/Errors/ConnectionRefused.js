module.exports = class ConnectionRefused extends require('./PersistrError') {
  constructor (server) {
    super(`Connection refused to Persistr Server${server ? ' at ' + server : ''}`)
  }
}
