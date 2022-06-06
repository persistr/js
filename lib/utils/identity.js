// TODO: This Identity class is unique to the API/HTTP store (it is HTTP Authorization header).
class Identity {
  constructor({ credentials }) {
    if (credentials) {
      this.username = credentials.username
      this.password = credentials.password
    }
  }

  get username() {
    return localStorage.getItem('username')
  }

  set username(value) {
    localStorage.setItem('username', value)
  }

  async authenticate(account, { username, password }) {
    localStorage.setItem('username', username)
    this.password = password
    await account.details()
  }

  forget() {
    localStorage.removeItem('authorization')
    localStorage.removeItem('username')
  }

  get credentials() {
    if (!this.username && !this.password) return undefined
    return { username: this.username, password: this.password }
  }

  async authorization() {
    const auth = localStorage.getItem('authorization')
    if (auth) return auth

    // If identity has API Secret Key credentials, use them.
    if (this.credentials && this.credentials.apikey) {
      return `Apikey ${this.credentials.apikey}`
    }

    // If identity has username and password credentials, use them.
    if (this.credentials && this.credentials.username && this.credentials.password) {
      const encoded = toBase64(`${this.credentials.username}:${this.credentials.password}`)
      return `Basic ${encoded}`
    }

    return undefined
  }

  async authorized(authorization) {
    localStorage.setItem('authorization', authorization)
  }

  async revoked(authorization) {
    localStorage.removeItem('authorization')
  }
}

function toBase64(text) {
  return btoa(unescape(encodeURIComponent(text)))
}

module.exports = Identity
