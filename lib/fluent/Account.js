class Account {
  constructor (connection, options) {
    this.connection = connection
    this.name = options?.name
    this.username = options?.username
  }

  get api() {
    return this.connection.api
  }

  async create ({ password }) {
    await this.api.createAccount({ name: this.name, username: this.username, password })
    return this
  }

  async destroy () {
    await this.api.destroyAccount({ username: this.username })
    return this
  }

  async activate () {
    await this.api.activateAccount({ username: this.username })
    return this
  }

  async deactivate () {
    await this.api.deactivateAccount({ username: this.username })
    return this
  }

  async profile () {
    if (this.username) return this.api.profileAccount({ username: this.username })
    return this.api.getAccount()
  }
}

module.exports = Account
