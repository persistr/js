const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(http, { identity, space, domain, stream, data, meta, id }) {
  if (!id) id = uuidv4()
  meta = { tz: DateTime.local().zoneName, ...meta }
  await http.put({ identity, endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events/${id}`, body: {
    //type: 'Bank Account',
    data: data || {},
    meta: meta
  }})
}
