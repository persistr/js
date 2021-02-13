const Account = require('./Account')
const Accounts = require('./Accounts')
const Database = require('./Database')
const Databases = require('./Databases')

class Connection {
  constructor (api) {
    this.api = api
  }

  async close() {
  }

  use (db) {
    return new Database(db, this)
  }

  databases () {
    return new Databases(this)
  }

  accounts () {
    return new Accounts(this)
  }

  account (options) {
    return new Account(this, options)
  }
}

module.exports = Connection
