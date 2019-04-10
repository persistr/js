module.exports = class StatusCode extends require('./PersistrError') {
  constructor (statusCode, statusText, responseText) {
    super(`${statusCode} ${statusText} ${responseText}`)
    this.statusCode = statusCode
  }
}
