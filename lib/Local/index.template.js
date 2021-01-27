const Errors = require('../Errors')

const endpoints = {{{endpoints}}}

class API {
  constructor() {
    this.type = 'local'
    this.store = {
      events: [],
      index: {
        events: {}
      },
      annotations: {}
    }
  }
  {{{methods}}}
}

module.exports = API
