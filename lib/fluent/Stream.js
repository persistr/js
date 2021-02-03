const Annotation = require('./Annotation')
const Event = require('./Event')
const Events = require('./Events')
const uuidv4 = require('uuid/v4')

class Stream {
  constructor(id, ns, details) {
    this.id = id || uuidv4()
    this.ns = ns

    if (details) {
      this.created = details.created
      this.modified = details.modified
      this.size = details.size
      this.annotation = details.annotation
    }
  }

  get api() {
    return this.account.api
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
    return this.api.annotateStream({ db: this.db.name, ns: this.ns.name, stream: this.id, annotation: annotation })
  }

  annotation() {
    return new Annotation(this)
  }

  async destroy() {
    return this.api.destroyStream({ db: this.db.name, ns: this.ns.name, stream: this.id })
  }
}

module.exports = Stream
