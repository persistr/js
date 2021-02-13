const Errors = require('../Errors')
const btoa = require('btoa')
const crossFetch = require('cross-fetch')
const fetch = require('fetch-retry')(crossFetch, {
  retryOn: [ 503 ],
  retries: 3,
  retryDelay: function(attempt, error, response) {
    const delay = Math.pow(7, attempt + 1) // 7ms, 49ms, 343ms
    return delay
  }
})

class HTTP {
  constructor(server, identity) {
    this.server = server
    this.identity = identity
    this.headers = {}
  }

  url({ endpoint, query }) {
    return `${this.server}${endpoint}${queryString(query)}`
  }

  async auth() {
    let headers = undefined
    let authorization = undefined
    if (this.identity && this.identity.authorization) {
      authorization = await this.identity.authorization()
    }
    if (authorization) {
      headers = { authorization }
    }
    else if (this.identity && this.identity.credentials) {
      if (this.identity.credentials.apikey) {
        headers = { 'Authorization': `Apikey ${this.identity.credentials.apikey}`, ...headers }
      }
      else if (this.identity.credentials.username && (this.identity.credentials.password !== undefined)) {
        const encoded = toBase64(`${this.identity.credentials.username}:${this.identity.credentials.password}`)
        headers = { 'Authorization': `Basic ${encoded}`, ...headers }
      }
    }
    return headers
  }

  async fetch({ method, endpoint, query, body, headers }) {
    const url = `${this.server}${endpoint}${queryString(query)}`

    let options = {
      method,
      headers: {
        ...this.headers,
        ...await this.auth(),
        'content-type': 'application/json',
        ...headers
      },
      credentials: 'same-origin',
      mode: 'cors'
    }

    if (body) {
      if (options.headers['content-type'] && options.headers['content-type'].includes('json')) {
        options.body = JSON.stringify(body)
      }
      else {
        options.body = body
      }
    }

    let response = undefined
    try {
      response = await fetch(url, { ...options })
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
