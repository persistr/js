const Annotation = require('./Annotation')
const Event = require('./Event')
const Events = require('./Events')
const uuid = require('uuid')

class Stream {
  constructor(id, ns, details) {
    this.id = id || uuid.v4()
    this.ns = ns

    if (details) {
      this.created = details.created
      this.modified = details.modified
      this.size = details.size
      this.annotation = details.annotation
    }
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

  events (options) {
    return new Events({ ...options, stream: this })
  }

  event(idOrType, data) {
    // There are 2 variants of this function that take in:
    // - 1 string parameter: event ID - selects existing event
    // - 2 parameters: string for event type and object for event data - creates new event
    return new Event({ stream: this, id: idOrType, type: idOrType, data })
  }

  async annotate(annotation) {
    return this.store.annotations.write({ db: this.db.name, ns: this.ns.name, stream: this.id, annotation })
  }

  annotation() {
    return new Annotation(this)
  }

  async destroy() {
    return this.store.annotations.destroy({ db: this.db.name, ns: this.ns.name, stream: this.id })
  }
}

module.exports = Stream
