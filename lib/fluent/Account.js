const Space = require('./Space')
const Spaces = require('./Spaces')
const Subscription = require('./Subscription')
const Subscriptions = require('./Subscriptions')

class Account {
  constructor (api) {
    this.api = api
  }

  async details () {
    return this.api.getAccount()
  }

  subscriptions(options) {
    return new Subscriptions(this, options)
  }

  subscription (id) {
    if (id && typeof id === 'object') {
      const options = id
      return new Subscription(this, options.id, options.filter, options.adapter)
    }
    return new Subscription(this, id)
  }

  spaces () {
    return new Spaces(this)
  }

  space (name) {
    return new Space(name, this)
  }
}

module.exports = Account
