module.exports = class StatusCode extends require('./PersistrError') {
  constructor (url, statusCode, statusText, responseText) {
    let message = `${url} ${statusCode} ${statusText}`

    try {
      const response = JSON.parse(responseText)
      if (response && response.error) message = `${message}: ${response.error}`
    }
    catch (error) {
    }

    super(message)

    this.statusCode = statusCode
  }
}
