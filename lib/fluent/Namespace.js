const Events = require('./Events')
const Stream = require('./Stream')
const Streams = require('./Streams')

class Namespace {
  constructor(name, db) {
    this.name = name
    this.db = db
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  streams() {
    return new Streams(this)
  }

  stream(id) {
    return new Stream(id, this)
  }

  events (options) {
    if (typeof options === 'string') options = { types: [ options ]}
    return new Events({ ...options, ns: this })
  }

  async create() {
    await this.api.createNamespace({ db: this.db.name, ns: this.name })
    return this
  }

  async destroy() {
    await this.api.destroyNamespace({ db: this.db.name, ns: this.name })
  }

  async truncate() {
    await this.api.truncateNamespace({ db: this.db.name, ns: this.name })
  }

  async rename(name) {
    await this.api.renameNamespace({ db: this.db.name, ns: this.name, to: name })
    this.name = name
    return this
  }

  async export() {
    await this.streams().each(stream => this.stream(stream.id).export())
    return this
  }
}

module.exports = Namespace
