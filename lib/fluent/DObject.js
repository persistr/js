const Mutation = require('./Mutation')

class DObject {
  constructor ({ domain, stream, type }) {
    this.domain = domain
    this.stream = stream
    this.type = type
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

  async latest(params) {
    const T = await this.domain.types().get(this.type)
    const instance = new T({ ...params, id: this.stream.id })
    await instance.latest()
    return instance
  }

  mutation (name) {
    return new Mutation({ object: this, name })
  }
}

module.exports = DObject
