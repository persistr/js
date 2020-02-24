module.exports = class InvalidTypeDefinition extends require('./PersistrError') {
  constructor (type) {
    super(`Invalid type definition '${type}'`)
  }
}
