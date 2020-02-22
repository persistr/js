const Fn = require('./Fn')
const Functions = require('./Functions')
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

  functions () {
    return new Functions(this)
  }

  fn (name, params) {
    return new Fn(this, name, params)
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

  databases () {
    return new Spaces(this)
  }

  space (name) {
    return new Space(name, this)
  }

  database (name) {
    return new Space(name, this)
  }

  db (name) {
    return new Space(name, this)
  }
}

module.exports = Account
