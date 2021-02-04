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

  async details () {
    return this.api.getAccount()
  }
}

module.exports = Connection
