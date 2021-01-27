const Errors = require('../Errors')
const HTTP = require('../utils/http')

const endpoints = {{{endpoints}}}

class API {
  constructor(identity, url) {
    this.type = 'persistr'
    this.identity = identity
    this.server = url
    this.http = new HTTP(this.server, this.identity)
  }
  {{{methods}}}
}

module.exports = API
