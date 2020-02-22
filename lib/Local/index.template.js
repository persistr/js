const Errors = require('../Errors')

const endpoints = {{{endpoints}}}

class API {
  constructor() {
    this.store = {
      events: [],
      index: {
        events: {}
      },
      annotations: {},
      functions: {},
      types: {}
    }
  }
  {{{methods}}}
}

module.exports = API