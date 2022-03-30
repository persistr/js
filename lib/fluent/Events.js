const Dedup = require('../utils/dedup')
const Event = require('./Event')
const Promise = require('bluebird')

// Enable Bluebird Promise cancellation.
Promise.config({ cancellation: true })

class Events {
  constructor ({ db, cursor, ns, stream, from, after, to, until, types, filters, limit }) {
    this._db = db
    this.cursor = cursor
    this._ns = ns
    this.stream = stream
    this.from = from
    this.after = after
    this.to = to
    this.until = until
    this.types = types
    this.filters = filters || []
    this.limit = limit
    this.shouldRead = true
  }

  get api() {
    return this.account.api
  }

  get account() {
    return this.db.account
  }

  get db() {
    return this._db || this.ns.db
  }

  get ns() {
    return this._ns || (this.stream ? this.stream.ns : undefined)
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

    return await this.api.writeStream({
      db: this.db.name,
      ns: this.ns?.name ?? '',
      stream: this.stream.id,
      id: params.id,
      data: params.data,
      meta: params.meta
    })
  }

  each(callback) {
    let dedup = new Dedup()
    let context = {
      db: this.db.name,
      cursor: this.cursor ? this.cursor.name : undefined,
      ns: this.ns ? this.ns.name : undefined,
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
      each: async (event, subscription) => {
        if (!event.meta || !event.meta.id || !dedup.seen(event.meta.id)) await callback(event, subscription)
      }
    }

    // The following async/await code is replaced with promises
    // in order to return a cancelable Bluebird promise. Otherwise,
    // async/await will wrap the return value into a native promise,
    // losing the ability to cancel the promise.

/*
    // Read events from the stream.
    let read = context.cursor ? this.api.readCursor.bind(this.api) : this.api.readDatabase.bind(this.api)
    let after = context.after
    while (true) {
      let last = await read({ ...context, after })
      if (cancelled || !last) break
      after = last
      context.from = undefined
    }
    return after
*/

    let promiseResolve
    let promiseReject
    let cancelled = false

    let readPromise = undefined
    let read = context.cursor ? this.api.readCursor.bind(this.api) : this.api.readDatabase.bind(this.api)
    let after = context.after
    function cb(last) {
      if (cancelled) {
        return
      }
      if (!last) {
        promiseResolve(after)
        return
      }
      after = last
      context.from = undefined
      readPromise = read({ ...context, after })
      readPromise.then(cb)
    }
    readPromise = read({ ...context, after })
    readPromise.then(cb)

    return new Promise((resolve, reject, onCancel) => {
      promiseResolve = resolve
      promiseReject = reject

      onCancel(function() {
        cancelled = true
        if (readPromise) {
          readPromise.cancel()
        }
      })
    })

  }
}

module.exports = Events
