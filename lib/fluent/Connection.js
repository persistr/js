const Account = require('./Account')
const Accounts = require('./Accounts')
const Database = require('./Database')
const Databases = require('./Databases')

class Connection {
  constructor (store) {
    this.store = store
  }

  async close() {
    await this.store.disconnect()
  }

  accounts () {
    return new Accounts(this)
  }

  account (options) {
    return new Account(this, options)
  }
}

module.exports = Connection
