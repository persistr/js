const Database = require('./Database')
const Databases = require('./Databases')

class Account {
  constructor (api) {
    this.api = api
  }

  async details () {
    return this.api.getAccount()
  }

  dbs () {
    return new Databases(this)
  }

  db (name) {
    return new Database(name, this)
  }

  databases () {
    return this.dbs()
  }

  database (name) {
    return this.db(name)
  }
}

module.exports = Account
