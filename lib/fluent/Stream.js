const Annotation = require('./Annotation')
const Event = require('./Event')
const Events = require('./Events')
const PObject = require('./PObject')
const fs = require('fs')
const uuidv4 = require('uuid/v4')

class Stream {
  constructor(id, domain) {
    this.id = id || uuidv4()
    this.domain = domain
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.space.account
  }

  get space() {
    return this.domain.space
  }

  events (options) {
    return new Events({ ...options, stream: this })
  }

  event(id) {
    return new Event(this, id)
  }

  async annotate(annotation) {
    return this.api.annotateStream({ space: this.space.name, domain: this.domain.name, stream: this.id, annotation: annotation })
  }

  annotation() {
    return new Annotation(this)
  }

  async as (type) {
    const T = await this.domain.types().get(type)
    return new T()
  }

  object (type) {
    return new PObject({ domain: this.domain, stream: this, type })
  }

  async destroy() {
    return this.api.destroyStream({ space: this.space.name, domain: this.domain.name, stream: this.id })
  }

  async export() {
    const file = `${this.space.name}.${this.domain.name}.${this.id}.json`
    if (fs.existsSync(file)) fs.truncateSync(file)
    await this.events({ until: 'caught-up' }).each(event => {
      fs.appendFileSync(file, `${JSON.stringify(event)}\n`)
    })
  }
}

module.exports = Stream
