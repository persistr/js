class Domains {
  constructor(space) {
    this.space = space
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.space.account
  }

  async each(callback) {
    // Make single API call to obtain list of all domains.
    return this.api.listDomains({ space: this.space.name, each: callback }).catch((error) => {
      throw error
    })
  }
}

module.exports = Domains
