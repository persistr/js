const PubSub = require('pubsub-js')
const matcher = require('matcher')

class Subscription {
  constructor(mq, channel, listener, types) {
    this.mq = mq
    this.channel = channel
    this.listener = listener
    this.types = types
    if (this.types) this.types = Array.isArray(types) ? types : [types]
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
    this.channels = new Map()
    this.pending = new Map()
  }

  publish({ channel, event }) {
    PubSub.publish(channel, event)
  }

  handler(channel, event) {
    let listeners = this.channels.get(channel)
    if (!listeners) {
      return // TODO: Unsubscribe from this channel?
    }

    // Notify all channel listeners.
    for (let item of listeners) {
      // Ignore event if listener is not interested in this event type.
      if (item.subscription.types) {
        let isValidType = false
        for (let type of item.subscription.types) {
          if (matcher.isMatch(event.meta.type, type)) {
            isValidType = true
            break
          }
        }
        if (!isValidType) continue
      }

      // Delay event if subscription is paused.
      if (item.subscription.paused) {
        item.subscription.delay(event)
        continue
      }

      // Deliver event immediately.
      item.listener(event, item.subscription)
    }
  }

  async subscribe({ channel, listener, types }) {
    // Add global PubNub listener, if not already present.
    if (!this.listener) {
      PubSub.subscribe(channel, this.handler.bind(this))
    }

    // Subscribe to this PubNub channel, if not already subscribed.
    let listeners = this.channels.get(channel) || []

    // Create cancelable subscription.
    let subscription = new Subscription(this, channel, listener, types)

    // Add the new channel listener.
    if (!listeners.find(item => item.listener === listener)) listeners.push({ listener, subscription })
    this.channels.set(channel, listeners)

    // Return cancelable subscription.
    return subscription
  }

  unsubscribe(options) {
    let { channel, listener } = options || {}

    // Unsubscribe from all channels, if no channel specified.
    if (!channel) {
      PubSub.clearAllSubscriptions()
      this.channels.clear()
      return
    }

    // Unsubscribe from a single channel.
    if (channel && !listener) {
      PubSub.unsubscribe(channel)
      this.channels.delete(channel)
      return
    }

    // Unsubscribe a single event listener.
    let listeners = this.channels.get(channel) || []
    listeners = listeners.filter(item => item.listener === listener)
    if (listeners.length === 0) {
      PubSub.unsubscribe(channel)
      this.channels.delete(channel)
      return
    }
    this.channels.set(channel, listeners)
  }
}

module.exports = MQ
