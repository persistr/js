class Annotation {
  constructor(stream) {
    this.stream = stream
  }

  get store() {
    return this.account.store
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
    return this.store.annotations.destroy({ db: this.db.name, ns: this.ns.name, stream: this.stream.id })
  }

  async read() {
    return this.store.annotations.read({ db: this.db.name, ns: this.ns.name, stream: this.stream.id })
  }
}

module.exports = Annotation
