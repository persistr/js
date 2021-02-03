const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(http, { db, ns, stream, data, meta, id }) {
  const event = { meta: { tz: DateTime.local().zoneName, ...meta, id: id ?? uuidv4(), db, ns, stream }, data: data ?? {} }
  await http.put({ endpoint: `/events/${event.meta.id}`, body: event })
  return event.meta.id
}
