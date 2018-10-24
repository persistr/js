class Subscriptions {
  constructor(account) {
    this.account = account
  }

  get api() {
    return this.account.api
  }

  async cancel() {
    this.api.messages.unsubscribe()
  }
}

module.exports = Subscriptions
