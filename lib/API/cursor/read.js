const AsyncQueue = require('async-queue')
const EventSource = require('eventsource')
const Errors = require('../../Errors')
const Promise = require('bluebird')

// Enable Bluebird Promise cancellation.
Promise.config({ cancellation: true })

module.exports = async function(http, { db, cursor, ns, stream, from, after, to, until, types, limit, each }) {
  // Stream events via SSE.
  const url = http.url({
    endpoint: `/db/${db}/cursors/${cursor}/events`,
    headers: { accept: 'text/event-stream' }
  })
  const source = new EventSource(url, { headers: await http.auth() })

  // Auto-advance cursor unless explicitly directed not to.
  let advance = true

  // Create a queue to handle async event processing.
  const queue = new AsyncQueue()

  // Handle errors.
  let promiseResolve
  let promiseReject
  source.addEventListener('error', error => {
    let response
    try {
      response = JSON.parse(error.data)
      if (!response || !response.name || !response.status) response = undefined
    }
    catch (parsingError) {
    }

    if (!error.message && !response) {
      // End of stream. We can close the connection now.
      source.close()
      if (!queue.running) promiseResolve()
      return
    }

    source.close()
    queue.jobs.length = 0
    if (error && error.code === 'ECONNREFUSED') promiseReject(new Errors.ConnectionRefused(http.server))
    else if (!response) promiseReject(new Errors.UnexpectedError(error.message))
    else promiseReject(new Errors.StatusCode(error.origin, response.status, response.name, response.message))
  })

  const notify = async (event, callback, subscription) => {
    queue.run(async (err, job) => {
      await callback(event, subscription)
      job.success()
      if (!queue.running) promiseResolve()
      if (advance) this.advanceCursor(http, { db, cursor, last: event.meta.id })
    })
  }

  // Handle events.
  source.addEventListener('message', message => {
    const event = JSON.parse(message.data)
    notify(event, each, {
      cancel: async () => {
        advance = false
        source.close()
        queue.jobs.length = 0
        promiseResolve()
      }
    })
  })

  return new Promise((resolve, reject, onCancel) => {
    promiseResolve = resolve
    promiseReject = reject

    onCancel(function() {
      advance = false
      source.close()
      queue.jobs.length = 0
    })
  })
}
