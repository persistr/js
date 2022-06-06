const Database = require('./Database')
const Databases = require('./Databases')

class Account {
  constructor (connection, options) {
    this.connection = connection
    this.name = options?.name
    this.username = options?.username
  }

  get store() {
    return this.connection.store
  }

  db (db) {
    return new Database(db, this)
  }

  databases () {
    return new Databases(this)
  }

  async create ({ password }) {
    await this.store.accounts.create({ name: this.name ?? '', username: this.username, password })
    return this
  }

  async destroy () {
    await this.store.accounts.destroy({ username: this.username })
    return this
  }

  async activate () {
    await this.store.accounts.activate({ username: this.username })
    return this
  }

  async deactivate () {
    await this.store.accounts.deactivate({ username: this.username })
    return this
  }

  async profile () {
    return await this.store.accounts.find({ username: this.username })
  }
}

module.exports = Account
