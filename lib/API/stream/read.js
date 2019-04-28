module.exports = async function(http, { space, domain, stream, from, after, to, until, types, limit, each }) {
  const { body: events } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events`, query: { types, from, after, to, until, limit }})
  let lastEventID = undefined
  for (const event of events) {
    lastEventID = event.meta.id
    await each(event)
  }
  return lastEventID
}
