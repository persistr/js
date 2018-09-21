var PubNub = require('pubnub')

class MQ {
  constructor(options) {
    this.pubnub = new PubNub({ subscribeKey: options.subscribeKey })
  }

  on(listener) {
    if (listener.status) {
      this.pubnub.addListener({
        status: statusEvent => {
          if (statusEvent.category === "PNConnectedCategory") {
            listener.status('connected')
          }
          else if (statusEvent.category === "PNReconnectedCategory") {
            listener.status('reconnected')
          }
        }
      })
    }

    if (listener.event) {
      this.pubnub.addListener({
        message: msg => {
          const event = msg.message
          listener.event(event)
        }
      })
    }
  }

  subscribe(channel) {
    this.pubnub.subscribe({ channels: [channel] })
  }
}

module.exports = MQ
