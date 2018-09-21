const Space = require('./Space')
const Spaces = require('./Spaces')

class Account {
  constructor (api) {
    this.api = api
  }

  spaces () {
    return new Spaces(this)
  }

  space (name) {
    return new Space(name, this)
  }
}

module.exports = Account
