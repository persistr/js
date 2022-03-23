const AsyncQueue = require('async-queue')
const EventSource = require('eventsource')
module.exports = async function(http, { db, id, changed }) {
    // Stream events via SSE.
  const url = http.url({
    endpoint: `/db/${db}/objects/${id}`,
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
  async function notify(payload, callback, subscription) {
    queue.run(async (err, job) => {
      await callback(payload, subscription)
      job.success()
      if (!queue.running) promiseResolve()
    })
  }

  // Handle events.
  source.addEventListener('message', message => {
    const object = JSON.parse(message.data)
    notify(object, changed, {
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
