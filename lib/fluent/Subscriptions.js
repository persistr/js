class Subscriptions {
  constructor(account, options) {
    this.account = account
    this.options = options
  }

  get api() {
    return this.account.api
  }

  async cancel() {
    this.api.messages.unsubscribe()
  }

  async all () {
    return this.api.listSubscriptions(this.options)
  }
}

module.exports = Subscriptions
