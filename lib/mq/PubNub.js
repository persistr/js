var PubNub = require('pubnub')

class MQ {
  constructor(options) {
    this.pubnub = new PubNub({ subscribeKey: options.subscribeKey })
    this.channels = []
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

  subscribe({ channel }) {
    this.channels.push(channel)
    this.pubnub.subscribe({ channels: [channel] })
  }

  unsubscribe({ channel }) {
    if (!channel) {
      this.pubnub.unsubscribe({ channels: this.channels })
      this.channels = []
      return
    }

    this.pubnub.unsubscribe({ channels: [channel] })
    const index = this.channels.indexOf(channel)
    if (index > -1) {
      this.channels.splice(index, 1)
    }
  }
}

module.exports = MQ
