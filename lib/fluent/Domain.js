const Events = require('./Events')
const Label = require('./Label')
const Model = require('./Model')
const PObject = require('./PObject')
const PObjects = require('./PObjects')
const Stream = require('./Stream')
const Streams = require('./Streams')
const Types = require('./Types')

class Domain {
  constructor(name, space) {
    this.name = name
    this.space = space
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.space.account
  }

  streams() {
    return new Streams(this)
  }

  stream(id) {
    return new Stream(id, this)
  }

  label(name) {
    return new Label(name, this)
  }

  events (options) {
    return new Events({ ...options, domain: this })
  }

  types () {
    return new Types({ domain: this })
  }

  model () {
    return new Model({ domain: this })
  }

  objects () {
    return new PObjects({ domain: this })
  }

  object (type) {
    return new PObject({ domain: this, type })
  }

  async create() {
    await this.api.createDomain({ space: this.space.name, domain: this.name })
    return this
  }

  async destroy() {
    await this.api.destroyDomain({ space: this.space.name, domain: this.name })
  }

  async truncate() {
    await this.api.truncateDomain({ space: this.space.name, domain: this.name })
  }

  async rename(name) {
    await this.api.renameDomain({ space: this.space.name, domain: this.name, to: name })
    this.name = name
    return this
  }

  async export() {
    await this.streams().each(stream => this.stream(stream.id).export())
    return this
  }
}

module.exports = Domain
