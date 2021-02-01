const AsyncQueue = require('async-queue')
const EventSource = require('eventsource')
module.exports = async function(http, { db, ns, stream, from, after, to, until, types, limit, each }) {
  // Stream events via SSE.
  const url = http.url({
    endpoint: `/db/${db}/events`,
    query: { ns, stream, types, from, after, to, until, limit, schema: 'jsonapi' },
    headers: { accept: 'text/event-stream' }
  })
  const source = new EventSource(url, { headers: await http.auth() })

  // Handle errors.
  let promiseResolve
  let promiseReject
  source.addEventListener('error', error => {
    if (!error.message) {
      // End of stream. We can close the connection now.
      source.close()
      return
    }
    source.close()
    queue.jobs.length = 0
    promiseReject(error)
  })

  // Create a queue to handle async event processing.
  const queue = new AsyncQueue()
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

  return new Promise((resolve, reject) => {
    promiseResolve = resolve
    promiseReject = reject
  })
}
