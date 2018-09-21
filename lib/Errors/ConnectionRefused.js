module.exports = class ConnectionRefused extends require('./PersistrError') {
  constructor () {
    super('Connection refused while attempting to connect to Persistr API')
  }
}
