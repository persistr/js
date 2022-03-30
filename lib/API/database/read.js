const AsyncQueue = require('async-queue')
const EventSource = require('eventsource')
const Errors = require('../../Errors')
const Promise = require('bluebird')

// Enable Bluebird Promise cancellation.
Promise.config({ cancellation: true })

// TODO: Replace async/await with cancelable Bluebird promise. Otherwise,
// async/await will wrap the return value into a native promise, losing
// the ability to cancel the promise.

module.exports = async function(http, { db, ns, stream, from, after, to, until, types, limit, each }) {
  // Stream events via SSE.
  const url = http.url({
    endpoint: `/db/${db}/events`,
    query: { ns, stream, types, from, after, to, until, limit, schema: 'jsonapi' },
    headers: { accept: 'text/event-stream' }
  })
  const source = new EventSource(url, { headers: await http.auth() })

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
    if (error && (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED'))) promiseReject(new Errors.ConnectionRefused(http.server))
    else if (!response) promiseReject(new Errors.UnexpectedError(error.message))
    else promiseReject(new Errors.StatusCode(error.origin, response.status, response.name, response.message))
  })

  async function notify(event, callback, subscription) {
    queue.run(async (err, job) => {
      await callback(event, subscription)
      job.success()
      if (!queue.running) promiseResolve()
    })
  }

  // Handle events.
  source.addEventListener('message', message => {
    const event = JSON.parse(message.data)
    notify(event, each, {
      cancel: async () => {
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
      source.close()
      queue.jobs.length = 0
    })
  })
}
