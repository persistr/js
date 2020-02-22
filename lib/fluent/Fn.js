class Fn {
  constructor(account, name, params) {
    this.account = account
    this.name = name
    this.params = params
  }

  get api() {
    return this.account.api
  }

  then(callback) {
    this.thencallback = callback
    return this
  }

  catch(callback) {
    this.catchcallback = callback
    return this
  }

  async invoke() {
    return this.api.invokeFunction({ name: this.name, params: this.params })
      .then(this.thencallback)
      .catch(this.catchcallback)
  }
}

module.exports = Fn
