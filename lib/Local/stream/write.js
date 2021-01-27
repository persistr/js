const { DateTime } = require('luxon')
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
}
