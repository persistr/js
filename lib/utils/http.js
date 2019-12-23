const Errors = require('../Errors')
const btoa = require('btoa')
const crossFetch = require('cross-fetch')
const fetch = require('tenacious-fetch')

class HTTP {
  constructor(server, identity) {
    this.server = server
    this.identity = identity
    this.headers = {}
  }

  async fetch({ method, endpoint, query, body, headers }) {
    const url = `${this.server}${endpoint}${queryString(query)}`

    let authorization = undefined
    if (this.identity && this.identity.authorization) {
      authorization = await this.identity.authorization()
    }
    if (authorization) {
      headers = { authorization, ...headers }
    }
    else if (this.identity && this.identity.credentials) {
      if (this.identity.credentials.apikey) {
        headers = { 'Authorization': `Apikey ${this.identity.credentials.apikey}`, ...headers }
      }
      else if (this.identity.credentials.email && this.identity.credentials.password) {
        const encoded = toBase64(`${this.identity.credentials.email}:${this.identity.credentials.password}`)
        headers = { 'Authorization': `Basic ${encoded}`, ...headers }
      }
    }

    let options = {
      method,
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        ...headers
      },
      credentials: 'same-origin',
      mode: 'cors'
    }

    if (body) options.body = JSON.stringify(body)

    let response = undefined
    try {
      response = await fetch(url, {
        ...options,
        onRetry: ({ retriesLeft, retryDelay, response }) => console.log(response.code, `retrying after ${retryDelay}ms`),
        fetcher: crossFetch,
        retries: 3,
        retryDelay: 10,
        factor: 7,
        retryStatus: [ 503 ]
      })
    }
    catch (error) {
      if (error.code === 'ECONNREFUSED') throw new Errors.ConnectionRefused()
      throw new Errors.Fetch(error.message)
    }

    if (!response.ok) {
      throw new Errors.StatusCode(url, response.status, response.statusText, await response.text())
    }

    // Update authorization on server request.
    if (response.headers.has('Authorization')) {
      if (this.identity.authorized) this.identity.authorized(response.headers.get('Authorization'))
    }

    // Convert result body to JSON.
    let text = await response.text()
    if (text) {
      if (response.headers.has('content-type')) {
        if (response.headers.get('content-type').includes('json')) {
          text = JSON.parse(text)
        }
      }
      else {
        text = JSON.parse(text)
      }
    }

    return {
      body: text ? text : ''
    }
  }

  async get(options) {
    return await this.fetch({ ...options, method: 'GET' })
  }

  async post(options) {
    return await this.fetch({ ...options, method: 'POST' })
  }

  async put(options) {
    return await this.fetch({ ...options, method: 'PUT' })
  }

  async patch(options) {
    return await this.fetch({ ...options, method: 'PATCH' })
  }

  async delete(options) {
    return await this.fetch({ ...options, method: 'DELETE' })
  }
}

function queryString(params) {
  let q = ''
  if (params && Object.keys(params).length > 0) {
    const encode = encodeURIComponent
    q = '?' + Object.entries(params).filter(param => param[0] && param[1]).map(param => encode(param[0]) + '=' + encode(param[1])).join('&')
  }
  return q
}

function toBase64(text) {
  return btoa(unescape(encodeURIComponent(text)))
}

module.exports = HTTP
