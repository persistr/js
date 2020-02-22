const fs = require('fs').promises

class Functions {
  constructor(account) {
    this.account = account
  }

  get api() {
    return this.account.api
  }

  async register(name, file) {
    const src = await fs.readFile(file, 'utf8')
    await this.api.registerFunction({ name, src })
  }

  async invoke(name, params) {
    await this.api.invokeFunction({ name, params })
  }
}

module.exports = Functions
