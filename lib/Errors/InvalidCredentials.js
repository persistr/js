module.exports = class InvalidCredentials extends require('./PersistrError') {
  constructor () {
    super('Invalid credentials')
  }
}
