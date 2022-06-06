class DatabaseObject {
  constructor(db, id, data) {
    this.db = db
    this.id = id
    this.data = data
  }

  get store() {
    return this.account.store
  }

  get account() {
    return this.db.account
  }

  async write() {
    return this.store.objects.write({ db: this.db.name, id: this.id, data: this.data })
  }

  async read() {
    return this.store.objects.read({ db: this.db.name, id: this.id })
  }

/*
  async watch(changed) {
    return this.store.objects.watch({ db: this.db.name, id: this.id, changed })
  }
*/

  async destroy() {
    return this.store.objects.destroy({ db: this.db.name, id: this.id })
  }
}

module.exports = DatabaseObject
