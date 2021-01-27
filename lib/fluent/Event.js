class Event {
  constructor(stream, id) {
    this.stream = stream
    this.id = id
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
}

module.exports = Event
