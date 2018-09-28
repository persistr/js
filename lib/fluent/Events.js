const AsyncQueue = require('async-queue')
const { DateTime } = require('luxon')
const { Duplex } = require('stream')
const Event = require('./Event')
const highland = require('../utils/highland')
const _ = require('highland')

class Events extends Duplex {
  constructor ({ domain, stream, after, until }) {
    super({ objectMode: true })

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

  async _read (size) {
    // Guard: Only initiate reading from the event stream once.
    if (!this.shouldRead) return
    this.shouldRead = false

    // Read historical events from the stream.
    let streamID = this.stream ? this.stream.id : undefined
    //await this.api.listEvents({ space: this.space.name, domain: this.domain.name, stream: streamID, after: this.after }, event => {
    if (this.stream) {
      await this.api.readStream({ space: this.space.name, domain: this.domain.name, stream: this.stream.id, after: this.after, until: this.until, each: event => {
        this.push(event)
      }})
      .catch(err => this.emit('error', err))
    }
    else {
      await this.api.readDomain({ space: this.space.name, domain: this.domain.name, after: this.after, until: this.until, each: event => {
        this.push(event)
      }})
      .catch(err => this.emit('error', err))
    }

    // Guard: Exit early if we don't want to read real-time events from the stream.
    if (this.until === 'caught-up') { this.push(null); return }

    // Read real-time events from the stream.
    this.api.messages.on({ event: event => {
      this.push(event)
    }})

    // Subscribe to real-time notifications for stream or domain.
    const channel = this.stream ? `${this.space.name}.${this.domain.name}.${this.stream.id}` : `${this.space.name}.${this.domain.name}`
    this.api.messages.subscribe({ channel })
    this.subscription = {
      cancel: async () => {
        this.api.messages.unsubscribe({ channel })
      }
    }
  }

  _write (params, encoding, callback) {
    if (!this.stream) throw new Errors.StreamNotSpecified(this.space.name, this.domain.name)
    this.api.writeStream({
      space: this.space.name,
      domain: this.domain.name,
      stream: this.stream.id,
      id: params.id,
      data: params.data,
      meta: params.meta
    })
    .then(callback())
    .catch((err) => callback(err))
  }

  async write(params, callback) {
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
      let queue = new AsyncQueue()
      this.on('end', () => {
        resolve(this)
      })
      this.on('error', (err) => {
        reject(err)
      })
      this.on('data', event => {
        queue.run(async (err, job) => {
          await callback(event, this.subscription)
          job.success()
        })
      })
    })
  }

  async reduce (options) {
    return _(this).through(highland.reduce(options))
  }
}

module.exports = Events
