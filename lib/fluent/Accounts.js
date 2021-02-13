const Account = require('./Account')

class Accounts {
  constructor(connection) {
    this.connection = connection
  }

  get api() {
    return this.connection.api
  }

  async each(callback) {
//    return this.api.listAccounts({ each: async account => await callback(this.connection.account(account)) }).catch(error => {
    return this.api.listAccounts({ each: async account => await callback(account) }).catch(error => {
      throw error
    })
  }

  async all() {
    let accounts = []
    await this.each(account => accounts.push(account))
    accounts.sort((a, b) => a.username.localeCompare(b.username))
    return accounts
  }
}

module.exports = Accounts
