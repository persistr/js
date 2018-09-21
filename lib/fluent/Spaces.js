class Spaces {
  constructor(account) {
    this.account = account
  }

  get api() {
    return this.account.api
  }

  async each(callback) {
    // Make single API call to obtain list of all spaces.
    return this.api.listSpaces({ each: callback }).catch((err) => {
      throw err
    })
  }
}

module.exports = Spaces
