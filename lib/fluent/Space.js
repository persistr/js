const Domain = require('./Domain')
const Domains = require('./Domains')
const Stream = require('./Stream')

class Space {
  constructor(name, account) {
    this.name = name
    this.account = account
  }

  get api() {
    return this.account.api
  }

  domains() {
    return new Domains(this)
  }

  namespaces() {
    return new Domains(this)
  }

  domain(name) {
    return new Domain(name, this)
  }

  namespace(name) {
    return new Domain(name, this)
  }

  ns(name) {
    return new Domain(name, this)
  }

  async create() {
    await this.api.createSpace({ space: this.name })
    return this
  }

  async clone (to) {
    await this.api.cloneSpace({ space: this.name, to })
  }

  async destroy() {
    await this.api.destroySpace({ space: this.name })
  }

  async rename(name) {
    await this.api.renameSpace({ space: this.name, to: name })
    this.name = name
    return this
  }

  async export() {
    await this.domains().each(name => this.domain(name).export())
    return this
  }

  async allow({ role, email }) {
    await this.api.allowAccount({ space: this.name, role, email })
    return this
  }

  async disallow({ role, email }) {
    await this.api.disallowAccount({ space: this.name, role, email })
    return this
  }
}

module.exports = Space
