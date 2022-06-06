const Namespace = require('./Namespace')

class Namespaces {
  constructor(db) {
    this.db = db
  }

  get store() {
    return this.account.store
  }

  get account() {
    return this.db.account
  }

  namespace(name) {
    return this.ns(name)
  }

  ns(name) {
    return new Namespace(name, this.db)
  }

  async each(callback) {
    const namespaces = this.store.namespaces.find({ db: this.db.name })
    for (const ns of namespaces) {
      await callback(this.ns(ns.id))
    }
  }

  async all() {
    return this.store.namespaces.find({ db: this.db.name })
  }
}

module.exports = Namespaces
