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

  async instance(params) {
    const T = await this.domain.types().get(this.type)
    return new T({ ...params, id: this.stream.id })
  }

  mutation (name) {
    return new Mutation({ object: this, name })
  }

/*
  async latest () {
    let streamID = this.stream ? this.stream.id : undefined
    return this.api.readObject({ space: this.space.name, domain: this.domain.name, stream: streamID, type: this.type })
  }
*/
}

module.exports = DObject
