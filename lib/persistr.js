const API = require('./API')
const Account = require('./fluent/Account')

class Persistr {
  async account(identity) {
    const api = new API(identity)
    return new Account(api)
  }
}

module.exports = new Persistr()
