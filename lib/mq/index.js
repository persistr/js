module.exports = {
  create: function(options) {
    if (options.type == 'PubNub') {
      const MQ = require('./PubNub')
      return new MQ(options)
    }
    else if (options.type == 'local') {
      const MQ = require('./local')
      return new MQ(options)
    }
  }
}
