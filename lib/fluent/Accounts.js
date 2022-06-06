const Account = require('./Account')

class Accounts {
  constructor(connection) {
    this.connection = connection
  }

  get store() {
    return this.connection.store
  }

  async each(callback) {
    const accounts = this.store.accounts.find()
    for (const account of accounts) {
      await callback(account)
    }
  }

  async all() {
    return this.store.accounts.find()
  }
}

module.exports = Accounts
