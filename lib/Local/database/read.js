const matcher = require('matcher')
module.exports = async function(store, { db, ns, stream, from, after, to, until, types, limit, each }) {
  // Filter events by database, namespace, and stream.
  let events = store.events.filter(event => event.meta.db === db && event.meta.ns === ns && event.meta.stream === stream)

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

  for (const event of events) {
    await each(event)
  }

  // Maintain an active subscription.
  if (!to && !until && events.length < limit) {
    store.subscriptions.push({ count: events.length, limit, db, ns, stream, types, each })
  }

  return undefined
}
