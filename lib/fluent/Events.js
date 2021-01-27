const AsyncQueue = require('async-queue')
const Errors = require('../Errors')
const Dedup = require('../utils/dedup')
const Event = require('./Event')

class Events {
  constructor ({ ns, stream, from, after, to, until, types, filters }) {
    this._ns = ns
    this.stream = stream
    this.from = from
    this.after = after
    this.to = to
    this.until = until
    this.types = types
    this.filters = filters || []
    this.shouldRead = true
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this.ns.db
  }

  get ns() {
    return this._ns || this.stream.ns
  }

  filter(options) {
    this.filters.push(options)
    return this
  }

  group(options) {
    this.groupby = options
    if (!this.until) this.until = 'caught-up'
    return this
  }

  rollup(options) {
    this.rollupto = options
    return this
  }

  async write(params) {
    if (Array.isArray(params)) {
      for (const event of params) {
        await this.api.writeStream({
          db: this.db.name,
          ns: this.ns.name,
          stream: this.stream.id,
          id: event.id,
          data: event.data,
          meta: event.meta
        })
      }
      return params.length
    }

    if (arguments.length === 1 && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
      params = {
        meta: { type: arguments[0] },
        data: {}
      }
    }

    if (arguments.length === 2) {
      params = {
        meta: { type: arguments[0] },
        data: { ...arguments[1] }
      }
    }

    await this.api.writeStream({
      db: this.db.name,
      ns: this.ns.name,
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
      db: this.db.name,
      ns: this.ns.name,
      stream: this.stream ? this.stream.id : undefined,
      from: this.from,
      after: this.after,
      to: this.to,
      until: this.until,
      types: this.types,
      filters: this.filters,
      groupby: this.groupby,
      rollupto: this.rollupto,
      limit: !this.groupby ? this.limit || 50 : undefined,
      each: async (event, subcription) => await notify(dedup, event, callback, subcription)
    }

    // Replay events from the stream.
    const after = await replay(this.api, context)
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
      if (!event.meta || !event.meta.id || !dedup.seen(event.meta.id)) await callback(event, subscription)
      resolve()
      job.success()
    })
  })
}

module.exports = Events
