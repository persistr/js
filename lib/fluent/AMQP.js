const amqp = require('amqp-connection-manager')

class AMQP {
  constructor (account, subscription) {
    this.account = account
    this.subscription = subscription
    this.queue = subscription.adapter.amqp.queue
    this.exchange = subscription.adapter.amqp.exchange
    this.connection = amqp.connect([ this.subscription.adapter.amqp.url ], { connectionOptions: { clientProperties: { app: `persistr/js ${process.env.npm_package_version}` }}})
    this.channel = this.connection.createChannel({
      json: true,
      setup: channel => {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue(this.queue.name, this.queue.options)
      }
    })
  }

  async on (callback) {
    await this.channel.addSetup(channel => {
      // `channel` here is a regular amqplib `ConfirmChannel`.
      return Promise.all([
        //channel.assertQueue(this.queue.name, this.queue.options),
        //channel.assertExchange(EXCHANGE_NAME, 'topic'),
        //channel.bindQueue(this.queue.name, "my-exchange", "create"),
        channel.prefetch(1),
        channel.consume(this.queue.name, async data => {
          try {
            const message = JSON.parse(data.content.toString())
            const event = message.event
            if (event) await callback(event)
            this.channel.ack(data)
          }
          catch (error) {
            console.log(error)
            this.channel.nack(data)
          }
        })
      ])
    })
    await this.account.subscription(this.subscription).create()
  }
}

module.exports = AMQP
