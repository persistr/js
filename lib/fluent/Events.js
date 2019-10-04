const AsyncQueue = require('async-queue')
const Dedup = require('../utils/dedup')
const Event = require('./Event')

class Events {
  constructor ({ domain, stream, from, after, to, until, types }) {
    this._domain = domain
    this.stream = stream
    this.from = from
    this.after = after
    this.to = to
    this.until = until
    this.types = types
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
    let dedup = new Dedup()
    let context = {
      space: this.space.name,
      domain: this.domain.name,
      stream: this.stream ? this.stream.id : undefined,
      from: this.from,
      after: this.after,
      to: this.to,
      until: this.until || 'caught-up',
      types: this.types,
      limit: this.limit || 50,
      each: async event => await notify(dedup, event, callback)
    }

    // Replay historical events from the stream.
    let after = 'past-events'
    if (this.after !== 'past-events') {
      after = await replay(this.api, context)
    }

    // Guard: Exit early if we don't want to read real-time events from the stream.
    if (this.to || this.until) {
      return
    }

    // Read real-time events from the stream.
    const channel = this.stream ? `${this.space.name}.${this.domain.name}.${this.stream.id}` : `${this.space.name}.${this.domain.name}`
    const listener = (event, subscription) => notify(dedup, event, callback, subscription)
    const subscription = await this.api.messages.subscribe({ channel, listener, types: this.types })

    // Catch up on missed events.
    if (after !== 'past-events') {
      await replay(this.api, { ...context, after, until: 'caught-up' })
    }

    // Resume processing real-time events.
    subscription.resume()

    // Return cancelable subscription.
    return subscription
  }
}

async function replay(api, context) {
  let read = context.stream ? api.readStream.bind(api) : api.readDomain.bind(api)
  let after = context.after
  while (true) {
    let last = await read({ ...context, after })
    if (!last) break
    after = last
    context.from = undefined
  }
  return after
}

const queue = new AsyncQueue()
async function notify(dedup, event, callback, subscription) {
  return new Promise(async (resolve, reject) => {
    queue.run(async (err, job) => {
      if (!dedup.seen(event.meta.id)) await callback(event, subscription)
      resolve()
      job.success()
    })
  })
}

module.exports = Events
