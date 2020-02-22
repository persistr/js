const Type = require('./Type')

class Types {
  constructor ({ domain }) {
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

  async define (name, spec) {
    await this.api.setType({ space: this.space.name, domain: this.domain.name, name, spec })
  }

  async get(name) {
    const spec = await this.api.getType({ space: this.space.name, domain: this.domain.name, name })
    return Type.define({ ...spec, repository: this.domain, registry: this.account })
  }
}

module.exports = Types
