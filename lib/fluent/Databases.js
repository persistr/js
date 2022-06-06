class Databases {
  constructor(account) {
    this.account = account
  }

  get store() {
    return this.account.store
  }

  async each(callback) {
    const databases = await this.store.databases.find()
    for (const db of databases) {
      await callback(db)
    }
  }

  async all() {
    return await this.store.databases.find()
  }
}

module.exports = Databases
