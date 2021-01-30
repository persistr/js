const Namespace = require('./Namespace')
const Namespaces = require('./Namespaces')
const Stream = require('./Stream')

class Database {
  constructor(name, account) {
    this.name = name
    this.account = account
  }

  get api() {
    return this.account.api
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

  streams() {
    return this.ns('').streams()
  }

  events (options) {
    return this.ns('').events(options)
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
