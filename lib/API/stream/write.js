const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(http, { db, ns, stream, data, meta, id }) {
  if (!id) id = uuidv4()
  meta = { tz: DateTime.local().zoneName, ...meta }
  await http.put({ endpoint: `/db/${db}/ns/${ns}/streams/${stream}/events/${id}`, body: {
    data: data || {},
    meta: meta
  }})
}
