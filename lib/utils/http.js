const Errors = require('../Errors')
const request = require('request-promise-native')

class HTTP {
  constructor(server) {
    this.server = server
    this.headers = {}
  }

  async get(options) {
    return postprocess(this, request(params(this, { ...options, server: this.server, method: 'GET' })))
  }

  async post(options) {
    return postprocess(this, request(params(this, { ...options, server: this.server, method: 'POST' })))
  }

  async put(options) {
    return postprocess(this, request(params(this, { ...options, server: this.server, method: 'PUT' })))
  }

  async delete(options) {
    return postprocess(this, request(params(this, { ...options, server: this.server, method: 'DELETE' })))
  }
}

function params(http, { method, server, endpoint, query, body, headers }) {
  var result = { method, uri: `${server}${endpoint}${queryString(query)}`, headers: { ...http.headers, "content-type": "application/json", ...headers }, resolveWithFullResponse: true }
  if (body) result.body = JSON.stringify(body)
  return result
}

function queryString(params) {
  let q = ''
  if (params && Object.keys(params).length > 0) {
    const encode = encodeURIComponent
    q = '?' + Object.entries(params).filter(param => param[0] && param[1]).map(param => encode(param[0]) + '=' + encode(param[1])).join('&')
  }
  return q
}

function postprocess(http, promise) {
  return promise.then(res => {
    // Convert result body to JSON.
    if (res.body) {
      res.body = JSON.parse(res.body)
    }

    // Update authorization on server request.
    if (res.headers.authorization) {
      http.headers.authorization = res.headers.authorization
    }

    return res
  })
}

module.exports = HTTP
