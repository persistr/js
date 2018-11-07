class PObjects {
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

  async all () {
    return this.api.listObjects({ space: this.space.name, domain: this.domain.name })
  }
}

module.exports = PObjects
