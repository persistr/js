class Identity {
  constructor({ credentials }) {
    if (credentials) {
      this.email = credentials.email
      this.password = credentials.password
    }
  }

  get email() {
    return localStorage.getItem('email')
  }

  set email(value) {
    localStorage.setItem('email', value)
  }

  async authenticate(account, { email, password }) {
    localStorage.setItem('email', email)
    this.password = password
    await account.details()
  }

  forget() {
    localStorage.removeItem('authorization')
    localStorage.removeItem('email')
  }

  get credentials() {
    if (!this.email && !this.password) return undefined
    return { email: this.email, password: this.password }
  }

  async authorization() {
    const auth = localStorage.getItem('authorization')
    if (auth) return auth

    // If identity has API Secret Key credentials, use them.
    if (this.credentials && this.credentials.apikey) {
      return `Apikey ${this.credentials.apikey}`
    }

    // If identity has email and password credentials, use them.
    if (this.credentials && this.credentials.email && this.credentials.password) {
      const encoded = toBase64(`${this.credentials.email}:${this.credentials.password}`)
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
