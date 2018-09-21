module.exports = class InvalidBearerToken extends require('./PersistrError') {
  constructor ({ bearer }) {
    super(`Invalid bearer token: ${bearer}`)
  }
}
