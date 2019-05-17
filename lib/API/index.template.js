const Errors = require('../Errors')
const HTTP = require('../utils/http')
var MQ = require('../mq')

const endpoints = {{{endpoints}}}

class API {
  constructor(identity) {
    this.identity = identity
    this.server = process.env.PERSISTR_API_URL || 'https://api.persistr.com'
    this.messages = MQ.create({
      type: 'PubNub',
      subscribeKey: 'sub-c-d2ea0032-8ef6-11e8-a15f-2efe3b6c3d95'
    })
    this.http = new HTTP(this.server, this.identity)
  }
  {{{methods}}}
}

module.exports = API
