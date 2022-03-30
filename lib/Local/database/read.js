const matcher = require('matcher')
const Promise = require('bluebird')

// Enable Bluebird Promise cancellation.
Promise.config({ cancellation: true })

module.exports = function(store, { db, ns, stream, from, after, to, until, types, limit, each }) {
  // Filter events by database, namespace, and stream.
  let events = store.events.filter(event => event.meta.db === db && (!ns || event.meta.ns === ns) && (!stream || event.meta.stream === stream))

  // Filter events by type.
  if (types) {
    types = Array.isArray(types) ? types : [types]
    events = events.filter(event => types.some(type => matcher.isMatch(event.meta.type, type)))
  }

  // Filter events by order.
  if (from) {
    const idx = events.findIndex(event => event.meta.id === from)
    if (idx >= 0) events = events.slice(idx)
  }
  if (after) {
    const idx = events.findIndex(event => event.meta.id === after)
    if (idx >= 0) events = events.slice(idx + 1)
  }
  if (to) {
    const idx = events.findIndex(event => event.meta.id === to)
    if (idx >= 0) events = events.slice(0, idx + 1)
  }
  if (until) {
    const idx = events.findIndex(event => event.meta.id === until)
    if (idx >= 0) events = events.slice(0, idx)
  }

  // Limit the number of returned events.
  if (limit) {
    events.length = Math.min(events.length, limit)
  }

  let promiseResolve
  let promiseReject
  let cancelled = false
  let index = undefined

  let promise = new Promise((resolve, reject, onCancel) => {
    promiseResolve = resolve
    promiseReject = reject

    onCancel(function() {
      cancelled = true
      store.subscriptions.splice(index, 1)
    })
  })

  // The following async/await code is replaced with promises
  // in order to return a cancelable Bluebird promise. Otherwise,
  // async/await will wrap the return value into a native promise,
  // losing the ability to cancel the promise.

/*
  for (const event of events) {
    if (cancelled) break
    await each(event)
  }

  // Maintain an active subscription.
  if (!cancelled && !to && !until && events.length < limit) {
    index = store.subscriptions.push({ count: events.length, limit, db, ns, stream, types, each }) - 1
  }
  else {
    promiseResolve()
  }
*/

  function handleEvent(i) {
    if (!cancelled && i < events.length) {
      each(events[i]).then(handleEvent.bind(null, i + 1))
    }
    else {
      // Maintain an active subscription.
      if (!cancelled && !to && !until && events.length < limit) {
        index = store.subscriptions.push({ count: events.length, limit, db, ns, stream, types, each }) - 1
      }
      else {
        promiseResolve()
      }
    }
  }
  handleEvent(0)

  return promise
}
