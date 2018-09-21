const Stream = require('./Stream')
const Label = require('./Label')

class Streams {
  constructor(domain) {
    this.domain = domain
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.space.account
  }

  get space() {
    return this.domain.space
  }

  async each(callback) {
    return this.api.listStreams({ space: this.space.name, domain: this.domain.name, each: callback }).catch((error) => {
      throw error
    })
  }
}

module.exports = Streams
