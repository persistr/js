const Events = require('./Events')
const Namespace = require('./Namespace')
const Namespaces = require('./Namespaces')
const Stream = require('./Stream')
const Streams = require('./Streams')

class Database {
  constructor(name, account) {
    this.name = name
    this.account = account
  }

  get api() {
    return this.account.api
  }

  use (db) {
    return new Database(db, this.account)
  }

  async close() {
    await this.account.close()
  }

  namespaces() {
    return new Namespaces(this)
  }

  namespace(name) {
    return this.ns(name)
  }

  ns(name) {
    return new Namespace(name, this)
  }

  streams(options) {
    if (options.ns) options.ns = this.ns(options.ns)
    return new Streams({ ...options, db: this })
  }

  events (options) {
    return new Events({ ...options, db: this })
  }

  stream(id) {
    return this.ns('').stream(id)
  }

  async create() {
    await this.api.createDatabase({ db: this.name })
    return this
  }

  async destroy() {
    await this.api.destroyDatabase({ db: this.name })
  }

  async rename(name) {
    await this.api.renameDatabase({ db: this.name, to: name })
    this.name = name
    return this
  }

  async grant({ role, email }) {
    await this.api.grantAccount({ db: this.name, role, email })
    return this
  }

  async revoke({ email }) {
    await this.api.revokeAccount({ db: this.name, email })
    return this
  }
}

module.exports = Database
