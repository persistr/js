const Stream = require('./Stream')

class Streams {
  constructor({ db, ns }) {
    this._db = db
    this.ns = ns
  }

  get api() {
    return this.account.api
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
    return this.api.listStreams({ db: this.db.name, ns: this.ns?.name, each: async stream => await callback(this.stream(stream.id, stream)) }).catch(error => {
      throw error
    })
  }

  async all() {
    let streams = []
    await this.each(stream => streams.push(stream))
    streams.sort((a, b) => a.id.localeCompare(b.id))
    return streams
  }
}

module.exports = Streams
