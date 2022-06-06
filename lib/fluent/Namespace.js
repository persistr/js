const Events = require('./Events')
const Stream = require('./Stream')
const Streams = require('./Streams')

class Namespace {
  constructor(name, db) {
    this.name = name
    this.db = db
  }

  get store() {
    return this.account.store
  }

  get account() {
    return this.db.account
  }

  streams() {
    return new Streams({ ns: this })
  }

  stream(id, details) {
    return new Stream(id, this, details)
  }

  events (options) {
    if (typeof options === 'string') options = { types: [ options ]}
    return new Events({ ...options, ns: this })
  }

  async create() {
    await this.store.namespaces.create({ db: this.db.name, ns: this.name })
    return this
  }

  async destroy() {
    await this.store.namespaces.destroy({ db: this.db.name, ns: this.name })
  }

  async truncate() {
    await this.store.namespaces.truncate({ db: this.db.name, ns: this.name })
  }

  async rename(name) {
    await this.store.namespaces.rename({ db: this.db.name, ns: this.name, to: name })
    this.name = name
    return this
  }

  async export() {
    await this.streams().each(stream => this.stream(stream.id).export())
    return this
  }
}

module.exports = Namespace
