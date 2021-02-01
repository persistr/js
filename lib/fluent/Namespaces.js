const Namespace = require('./Namespace')

class Namespaces {
  constructor(db) {
    this.db = db
  }

  get api() {
    return this.account.api
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
    // Make single API call to obtain list of all namespaces.
    return this.api.listNamespaces({ db: this.db.name, each: async id => await callback(this.ns(id)) }).catch(error => {
      throw error
    })
  }

  async all() {
    let namespaces = []
    await this.each(ns => namespaces.push(ns))
    namespaces.sort((a, b) => a.name.localeCompare(b.name))
    return namespaces
  }
}

module.exports = Namespaces
