class Subscription {
  constructor(account, id, filter, adapter) {
    this.account = account
    this.id = id
    this.filter = filter
    this.adapter = adapter
  }

  get api() {
    return this.account.api
  }

  async create () {
    return this.api.createSubscription({ adapter: this.adapter, filter: this.filter })
    // TODO: Set this.id from return value
  }

  async destroy () {
    return this.api.destroySubscription({ id: this.id })
  }
}

module.exports = Subscription
