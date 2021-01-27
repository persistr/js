const Stream = require('./Stream')

class Streams {
  constructor(ns) {
    this.ns = ns
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this.ns.db
  }

  stream(id) {
    return this.ns.stream(id)
  }

  async each(callback) {
    return this.api.listStreams({ db: this.db.name, ns: this.ns.name, each: async id => await callback(this.stream(id)) }).catch(error => {
      throw error
    })
  }
}

module.exports = Streams
