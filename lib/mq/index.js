module.exports = {
  create: function(options) {
    if (options.type == 'PubNub') {
      const MQ = require('./PubNub')
      return new MQ(options)
    }
  }
}
