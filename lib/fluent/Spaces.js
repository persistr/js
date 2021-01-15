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

  async all() {
    let spaces = []
    await this.each(space => spaces.push(space))
    spaces.sort((a, b) => a.localeCompare(b))
    return spaces
  }
}

module.exports = Spaces
