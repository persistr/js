const Tortoise = require('tortoise')

class AMQP {
  constructor (account, subscription) {
    this.account = account
    this.subscription = subscription
    this.queue = subscription.adapter.amqp.queue
    this.exchange = subscription.adapter.amqp.exchange
    this.tortoise = new Tortoise(subscription.adapter.amqp.url, {
        connectRetries: -1,
        connectRetryInterval: 1000
    })
  }

  async on (callback) {
    await this.account.subscription(this.subscription).create()

    this.tortoise
      .queue(this.queue.name, this.queue.options)
      .exchange(this.exchange.name, this.exchange.type, this.exchange.key, this.exchange.options)
      .prefetch(1)
      .json()
      .subscribe(async (message, ack, nack) => {
        try {
          const event = message.event
          if (event) callback(event)
          ack()
        }
        catch (error) {
          console.log(error)
          nack()
        }
      })
  }
}

module.exports = AMQP
