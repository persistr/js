const Space = require('./Space')
const Spaces = require('./Spaces')
const Subscriptions = require('./Subscriptions')

class Account {
  constructor (api) {
    this.api = api
  }

  async details () {
    return this.api.getAccount()
  }

  subscriptions() {
    return new Subscriptions(this)
  }

  spaces () {
    return new Spaces(this)
  }

  space (name) {
    return new Space(name, this)
  }
}

module.exports = Account
