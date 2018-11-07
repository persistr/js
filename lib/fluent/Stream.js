const Annotation = require('./Annotation')
const Event = require('./Event')
const Events = require('./Events')
const PObject = require('./PObject')
var fs = require('fs')

class Stream {
  constructor(id, domain) {
    this.id = id
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
    return new Event(this.api, this, id)
  }

  async annotate(annotation) {
    return this.api.annotateStream({ space: this.space.name, domain: this.domain.name, stream: this.id, annotation: annotation })
  }

  annotation() {
    return new Annotation(this)
  }

  object (type) {
    return new PObject({ domain: this.domain.name, stream: this, type })
  }

  async destroy() {
    return this.api.destroyStream({ space: this.space.name, domain: this.domain.name, stream: this.id })
  }

  async export() {
    const file = `${this.space.name}.${this.domain.name}.${this.id}.json`
    var count = 0
    fs.writeFileSync(file, `[`)
    await this.until('caught-up').each(event => {
      if (count > 0) fs.appendFileSync(file, ',')
      fs.appendFileSync(file, JSON.stringify(event))
      count++
    })
    fs.appendFileSync(file, `]`)
  }
}

module.exports = Stream
