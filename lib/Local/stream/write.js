const { DateTime } = require('luxon')
const matcher = require('matcher')
const uuidv4 = require('uuid/v4')
module.exports = async function(store, { db, ns, stream, data, meta, id }) {
  const event = {
    data: data || {},
    meta: {
      tz: DateTime.local().zoneName,
      ts: (new Date()).toISOString(),
      ...meta,
      id: id || uuidv4(),
      stream,
      ns,
      db
    }
  }
  const index = store.events.push(event) - 1
  store.index.events[`${db}.${ns}.${stream}.${event.meta.id}`] = index

  for (let i = 0; i < store.subscriptions.length; i++) {
    const sub = store.subscriptions[i]

    let events = [ event ]

    // Filter events by database, namespace, and stream.
    const { db, ns, stream, types, limit, each } = sub
    events = events.filter(event => event.meta.db === db && 
      (event.meta.ns === ns || !ns) && 
      (event.meta.stream === stream || !stream))

    // Filter events by type.
    if (types) {
      events = events.filter(event => types.some(type => matcher.isMatch(event.meta.type, type)))
    }

/*
    // Limit the number of returned events.
    if (limit) {
      events.length = Math.min(sub.count + events.length, limit) - sub.count
    }
*/

    for (const event of events) {
      await each(event)
    }

    sub.count += events.length

/*
    if (limit && sub.count >= limit) {
      store.subscriptions.splice(i, 1)
    }
*/
  }

  return event
}
