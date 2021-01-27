const Annotation = require('./Annotation')
const Event = require('./Event')
const Events = require('./Events')
const uuidv4 = require('uuid/v4')

class Stream {
  constructor(id, ns) {
    this.id = id || uuidv4()
    this.ns = ns
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

  event(id) {
    return new Event(this, id)
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
