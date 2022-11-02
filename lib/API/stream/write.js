const { DateTime } = require('luxon')
const uuid = require('uuid')
module.exports = async function(http, { db, ns, stream, data, meta, id }) {
  const event = { meta: { tz: DateTime.local().zoneName, ...meta, id: id ?? uuid.v4(), db, ns, stream }, data: data ?? {} }
  await http.put({ endpoint: `/events/${event.meta.id}`, body: event })
  return event
}
