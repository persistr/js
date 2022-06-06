const Stream = require('./Stream')

class Streams {
  constructor({ db, ns }) {
    this._db = db
    this.ns = ns
  }

  get store() {
    return this.account.store
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this._db || this.ns?.db
  }

  stream(id, details) {
    const ns = (details.ns !== undefined) ? this.db.ns(details.ns) : this.ns
    return ns.stream(id, details)
  }

  async each(callback) {
    const streams = this.store.streams.find({ db: this.db.name, ns: this.ns?.name })
    for (const stream of streams) {
      await callback(this.stream(stream.id, stream))
    }
  }

  async all() {
    return this.store.streams.find({ db: this.db.name, ns: this.ns?.name })
  }
}

module.exports = Streams
