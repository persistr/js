class Event {
  constructor({ stream, id, type, data }) {
    this.stream = stream
    this.id = id
    this.type = type
    this.data = data
  }

  get store() {
    return this.account.store
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this.ns.db
  }

  get ns() {
    return this.stream.ns
  }

  async destroy() {
    return await this.store.events.destroy({ db: this.db.name, ns: this.ns.name, stream: this.stream.id, event: this.id })
  }

  async read() {
    return await this.store.events.read({ db: this.db.name, ns: this.ns.name, stream: this.stream.id, event: this.id })
  }

  async append() {
    return await this.stream.events().write(this.type, this.data)
  }
}

module.exports = Event
