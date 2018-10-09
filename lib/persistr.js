const API = require('./API')
const Account = require('./fluent/Account')

class Persistr {
  account(identity) {
    const api = new API(identity)
    return new Account(api)
  }
}

module.exports = { Persistr, persistr: new Persistr() }
