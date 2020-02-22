class Mutation {
  constructor ({ object, name }) {
    this.object = object
    this.name = name
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

  get domain() {
    return this.object.domain
  }

  async invoke (params) {
    return this.api.mutateObject({ space: this.space.name, domain: this.domain.name, stream: this.object.stream.id, type: this.object.type, mutation: this.name, params })
  }
}

module.exports = Mutation
