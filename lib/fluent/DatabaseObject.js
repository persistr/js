class DatabaseObject {
  constructor(db, id, data) {
    this.db = db
    this.id = id
    this.data = data
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  async write() {
    return this.api.writeObject({ db: this.db.name, id: this.id, data: this.data })
  }

  async read() {
    return this.api.readObject({ db: this.db.name, id: this.id })
  }

  async watch(changed) {
    return this.api.watchObject({ db: this.db.name, id: this.id, changed })
  }

  async destroy() {
    return this.api.destroyObject({ db: this.db.name, id: this.id })
  }
}

module.exports = DatabaseObject
