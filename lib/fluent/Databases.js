class Databases {
  constructor(account) {
    this.account = account
  }

  get api() {
    return this.account.api
  }

  async each(callback) {
    // Make single API call to obtain list of all databases.
    return this.api.listDatabases({ each: callback }).catch((err) => {
      throw err
    })
  }

  async all() {
    let databases = []
    await this.each(db => databases.push(db))
    databases.sort((a, b) => a.localeCompare(b))
    return databases
  }
}

module.exports = Databases
