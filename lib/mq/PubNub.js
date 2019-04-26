var PubNub = require('pubnub')

class Subscription {
  constructor(mq, channel, listener) {
    this.mq = mq
    this.channel = channel
    this.listener = listener
    this.events = []
    this.paused = true
  }

  cancel() {
    this.mq.unsubscribe({ channel: this.channel, listener: this.listener })
  }

  pause() {
    this.paused = true
  }

  resume() {
    // Deliver all waiting events.
    let event = this.events.shift()
    while (event) {
      this.listener(event, this)
      event = this.events.shift()
    }

    // Resume real-time event processing.
    this.paused = false
  }

  delay(event) {
    this.events.push(event)
  }
}

class MQ {
  constructor(options) {
    this.pubnub = new PubNub({ subscribeKey: options.subscribeKey })
    this.channels = new Map()
    this.pending = new Map()
  }

  status(s) {
    if (s.operation === 'PNSubscribeOperation') {
      if (s && s.affectedChannels && s.affectedChannels.length) {
        for (let channel of s.affectedChannels) {
          let promise = this.pending.get(channel)
          if (promise) {
            promise.resolve()
            this.pending.delete(channel)
          }
        }
      }
    }
  }

  handler(msg) {
    // Obtain the event payload encoded in the message.
    const event = msg.message

    // Obtain the channel the message was sent on.
    const channel = msg.channel
    let listeners = this.channels.get(channel)
    if (!listeners) {
      return // TODO: Unsubscribe from this channel?
    }

    // Notify all channel listeners.
    for (let item of listeners) {
      // Delay event if subscription is paused.
      if (item.subscription.paused) {
        item.subscription.delay(event)
        continue
      }

      // Deliver event immediately.
      item.listener(event, item.subscription)
    }
  }

  async subscribe({ channel, listener }) {
    // Add global PubNub listener, if not already present.
    if (!this.listener) {
      this.listener = { status: this.status.bind(this), message: this.handler.bind(this) }
      this.pubnub.addListener(this.listener)
    }

    // Subscribe to this PubNub channel, if not already subscribed.
    let needsSubscription = false
    let listeners = this.channels.get(channel)
    if (!listeners) {
      listeners = []
      needsSubscription = true
    }

    // Create cancelable subscription.
    let subscription = new Subscription(this, channel, listener)

    // Add the new channel listener.
    if (!listeners.find(item => item.listener === listener)) listeners.push({ listener, subscription })
    this.channels.set(channel, listeners)

    if (needsSubscription) {
      let promise = new Promise((resolve, reject) => {
        this.pending.set(channel, { resolve, reject })
        this.pubnub.subscribe({ channels: [channel] })
      })
      await promise
    }

    // Return cancelable subscription.
    return subscription
  }

  unsubscribe(options) {
    let { channel, listener } = options || {}

    // Unsubscribe from all channels, if no channel specified.
    if (!channel) {
      this.pubnub.unsubscribe({ channels: Array.from(this.channels.keys()) })
      this.channels.clear()
      return
    }

    // Unsubscribe from a single channel.
    if (channel && !listener) {
      this.pubnub.unsubscribe({ channels: [channel] })
      this.channels.delete(channel)
      return
    }

    // Unsubscribe a single event listener.
    let listeners = this.channels.get(channel) || []
    listeners = listeners.filter(item => item.listener === listener)
    if (listeners.length === 0) {
      this.pubnub.unsubscribe({ channels: [channel] })
      this.channels.delete(channel)
      return
    }
    this.channels.set(channel, listeners)
  }
}

module.exports = MQ
