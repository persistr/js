const AsyncQueue = require('async-queue')
const Event = require('./Event')

class Events {
  constructor ({ domain, stream, after, until }) {
    this._domain = domain
    this.stream = stream
    this.after = after
    this.until = until
    this.shouldRead = true
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.space.account
  }

  get space() {
    return this.domain.space
  }

  get domain() {
    return this._domain || this.stream.domain
  }

  async write(params) {
    if (Array.isArray(params)) {
      for (const event of params) {
        await this.api.writeStream({
          space: this.space.name,
          domain: this.domain.name,
          stream: this.stream.id,
          id: event.id,
          data: event.data,
          meta: event.meta
        })
      }
      return params.length
    }

    await this.api.writeStream({
      space: this.space.name,
      domain: this.domain.name,
      stream: this.stream.id,
      id: params.id,
      data: params.data,
      meta: params.meta
    })
    return 1
  }

  async each(callback) {
    return new Promise(async (resolve, reject) => {
      // Read historical events from the stream.
      if (this.after !== 'past-events') {
        const limit = this.limit || 50
        if (this.stream) {
          let after = this.after
          do {
            let last = undefined
            await this.api.readStream({ space: this.space.name, domain: this.domain.name, stream: this.stream.id, after, until: this.until || 'caught-up', limit, each: async event => {
              last = event.meta.id
              await notify(event, callback)
            }})
            .catch(err => console.log(err))
            after = last
          }
          while (after)
        }
        else {
          let after = this.after
          do {
            let last = undefined
            await this.api.readDomain({ space: this.space.name, domain: this.domain.name, after, until: this.until || 'caught-up', limit, each: async event => {
              last = `${event.meta.stream}.${event.meta.id}`
              await notify(event, callback)
            }})
            .catch(err => console.log(err))
            after = last
          }
          while (after)
        }
      }

      // Guard: Exit early if we don't want to read real-time events from the stream.
      if (this.until === 'caught-up') {
        resolve()
        return
      }

      // Read real-time events from the stream.
      const channel = this.stream ? `${this.space.name}.${this.domain.name}.${this.stream.id}` : `${this.space.name}.${this.domain.name}`
      const listener = (event, subscription) => notify(event, callback, subscription)
      const subscription = await this.api.messages.subscribe({ channel, listener })

      // Resolve promise with cancelable subscription.
      resolve(subscription)
    })
  }
}

const queue = new AsyncQueue()
async function notify(event, callback, subscription) {
  return new Promise(async (resolve, reject) => {
    queue.run(async (err, job) => {
      await callback(event, subscription)
      resolve()
      job.success()
    })
  })
}

module.exports = Events
