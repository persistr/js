module.exports = class InvalidTypeDefinition extends require('./PersistrError') {
  constructor (type, error) {
    super(`Invalid type definition '${type}'`, error)
  }
}
