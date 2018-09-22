const Errors = require('../Errors')
const request = require('request-promise-native')

class HTTP {
  constructor(server, identity) {
    this.server = server
    this.identity = identity
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
  var result = {
    method,
    uri: `${server}${endpoint}${queryString(query)}`,
    headers: {
      ...http.headers,
      "content-type": "application/json",
      ...authorize(http.identity),
      ...headers
    },
    resolveWithFullResponse: true
  }
  if (body) result.body = JSON.stringify(body)
  return result
}

function authorize(identity) {
  let headers = {}

  // If identity is in possession of previously authenticated credentials, use them.
  if (identity.authorization) {
    headers.authorization = identity.authorization()
  }

  // If identity has API Secret Key credentials, use them.
  if (!headers.authorization && identity.credentials && identity.credentials.apikey) {
    headers.authorization = `Apikey ${identity.credentials.apikey}`
  }

  // If identity has email and password credentials, use them.
  if (!headers.authorization && identity.credentials && identity.credentials.email && identity.credentials.password) {
    const encoded = Buffer.from(`${identity.credentials.email}:${identity.credentials.password}`).toString('base64')
    headers.authorization = `Basic ${encoded}`
  }

  return headers
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
      if (http.identity.authorized) http.identity.authorized(res.headers.authorization)
    }

    return res
  })
}

module.exports = HTTP
