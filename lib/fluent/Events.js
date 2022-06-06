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

  get store() {
    return this.account.store
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

  async write(event) {
    if (arguments.length === 1 && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
      event = {
        meta: { type: arguments[0] },
        data: {}
      }
    }

    if (arguments.length === 2) {
      event = {
        meta: { type: arguments[0] },
        data: { ...arguments[1] }
      }
    }

    return await this.store.events.write({
      data: event.data,
      meta: {
        db: this.db.name,
        ns: this.ns?.name ?? '',
        stream: this.stream.id,
        ...Object.keys(event.meta).filter(key => key === 'type' || key === 'id').reduce((acc, key) => ({ ...acc, [key]: event.meta[key] }), {})
      }
    })
  }

  async each(callback, cancellation) {
    // Configure search query.
    let query = {
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
      limit: !this.groupby ? this.limit : undefined
    }

    // Clean up the search query (remove keys with undefined values).
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key].length === 0) {
        delete query[key]
      }
    })

    await this.store.events.find({ ...query, callback, cancellation })
  }
}

module.exports = Events
