class Event {
  constructor({ stream, id, type, data }) {
    this.stream = stream
    this.id = id
    this.type = type
    this.data = data
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
    return this.account.api.destroyEvent({ db: this.db.name, ns: this.ns.name, stream: this.stream.id, event: this.id })
  }

  async read() {
    return this.account.api.readEvent({ db: this.db.name, ns: this.ns.name, stream: this.stream.id, event: this.id })
  }

  async append() {
    return await this.stream.events().write(this.type, this.data)
  }
}

module.exports = Event
