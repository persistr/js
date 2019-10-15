const Errors = require('../Errors')
const HTTP = require('../utils/http')
var MQ = require('../mq')

const endpoints = {{{endpoints}}}

class API {
  constructor(identity) {
    this.identity = identity
    this.server = process.env.PERSISTR_API_URL || 'https://api.persistr.com'
    this.http = new HTTP(this.server, this.identity)
  }
  {{{methods}}}
}

module.exports = API
