const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(store, { space, domain, stream, data, meta, id }) {
  const event = {
    data: data || {},
    meta: {
      id: id || uuidv4(),
      tz: DateTime.local().zoneName,
      ts: (new Date()).toISOString(),
      ...meta,
      stream,
      domain,
      space
    }
  }
  const index = store.events.push(event) - 1
  store.index.events[`${space}.${domain}.${stream}.${event.meta.id}`] = index
  await store.messages.publish({ channel: `${event.meta.space}.${event.meta.domain}.${event.meta.stream}`, event })
  await store.messages.publish({ channel: `${event.meta.space}.${event.meta.domain}`, event })
}
