module.exports = class InternalError extends require('./PersistrError') {
  constructor (error) {
    if (error) { super(`Internal error\nWhat went wrong:\n${error.message}`); return }
    super('Internal error')
  }
}
