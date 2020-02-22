const Type = require('./Type')
const fs = require('fs').promises
const nodeEval = require('node-eval')

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

  async define (name, file) {
    const spec = await fs.readFile(file, 'utf8')
    await this.api.setType({ space: this.space.name, domain: this.domain.name, name, spec })
  }

  async get(name) {
    const spec = await this.api.getType({ space: this.space.name, domain: this.domain.name, name })
    const definition = nodeEval(spec, `./${name}.js`)
    return Type.define({ ...definition, repository: this.domain, registry: this.account })
  }
}

module.exports = Types
