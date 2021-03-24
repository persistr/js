const Cursor = require('./Cursor')

class Cursors {
  constructor(db) {
    this.db = db
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  cursor(name, options) {
    return new Cursor(this.db, name, options)
  }

  async each(callback) {
    return this.api.listCursors({ db: this.db.name, each: async cursor => await callback(cursor) }).catch(error => {
      throw error
    })
  }

  async all() {
    let cursors = []
    await this.each(cursor => cursors.push(cursor))
    return cursors
  }
}

module.exports = Cursors
