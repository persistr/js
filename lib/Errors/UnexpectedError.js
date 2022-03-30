module.exports = class UnexpectedError extends require('./PersistrError') {
  constructor (message) {
    super(message)
  }
}
