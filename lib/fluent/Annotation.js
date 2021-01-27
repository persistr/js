class Annotation {
  constructor(stream) {
    this.stream = stream
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this.ns.db
  }

  get ns() {
    return this.stream.ns
  }

  async destroy() {
    return this.api.destroyAnnotation({ db: this.db.name, ns: this.ns.name, stream: this.stream.id })
  }

  async read() {
    return this.api.readAnnotation({ db: this.db.name, ns: this.ns.name, stream: this.stream.id })
  }
}

module.exports = Annotation
