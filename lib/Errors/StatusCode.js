module.exports = class StatusCode extends require('./PersistrError') {
  constructor (url, statusCode, statusText, responseText) {
    let message = responseText
    try {
      const response = JSON.parse(responseText)
      if (response && response.error) message = `${response.error}`
    }
    catch (error) {
    }

    super(message)

    this.url = url
    this.statusCode = statusCode
    this.statusText = statusText
    this.responseText = responseText
  }
}
