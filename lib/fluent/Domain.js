const Stream = require('./Stream')
const Streams = require('./Streams')
const Label = require('./Label')

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

  async define(options) {
    // TODO
    // Send contents of .spec file to Persistr API
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

  async create() {
    await this.api.createDomain({ space: this.space.name, domain: this.name })
    return this
  }

  async destroy() {
    await this.api.destroyDomain({ space: this.space.name, domain: this.name })
  }

  async rename(name) {
    await this.api.renameDomain({ space: this.space.name, domain: this.name, to: name })
    this.name = name
    return this
  }

  async export() {
    await this.streams().each(id => this.stream(id).export())
    return this
  }
}

module.exports = Domain
