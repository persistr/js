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

  async each(callback) {
    // Make single API call to obtain list of all namespaces.
    return this.api.listNamespaces({ db: this.db.name, each: callback }).catch(error => {
      throw error
    })
  }
}

module.exports = Namespaces
