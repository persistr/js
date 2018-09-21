const API = require('./API')
const Account = require('./fluent/Account')

class Persistr {
  constructor(credentials) {
    this.credentials = credentials
  }

  async account() {
    if (!this.api) this.api = await connect(this.credentials)
    return new Account(this.api)
  }
}

async function connect(credentials) {
  let api = new API()
  if (credentials.apikey) api.http.headers.authorization = `Apikey ${credentials.apikey}`
  await api.authenticateAccount(credentials)
  return api
}

module.exports = Persistr
