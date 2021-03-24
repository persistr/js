const Events = require('./Events')

class Cursor {
  constructor(db, name, options) {
    this.db = db
    this.name = name
    this.options = options
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  events() {
    return new Events({ ...this.options, db: this.db, cursor: this })
  }

  async create() {
    return this.api.createCursor({ db: this.db.name, cursor: this.name, options: this.options })
  }

  async destroy() {
    return this.api.destroyCursor({ db: this.db.name, cursor: this.name })
  }

  async rewind() {
    return this.api.rewindCursor({ db: this.db.name, cursor: this.name })
  }

  async details() {
    return this.api.getCursor({ db: this.db.name, cursor: this.name })
  }

  async read() {
    return this.api.getCursor({ db: this.db.name, cursor: this.name })
  }
}

module.exports = Cursor
