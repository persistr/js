module.exports = class StatusCode extends require('./PersistrError') {
  constructor (statusCode, statusText, responseText) {
    let message = ''
    try { message = ': ' + JSON.parse(responseText).error }
    catch (error) { message = '' }

    super(`${statusCode} ${statusText}${message}`)

    this.statusCode = statusCode
  }
}
