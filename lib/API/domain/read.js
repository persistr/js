module.exports = async function(http, { space, domain, after, until, limit, each }) {
  const { body: events } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/events`, query: { after, until, limit }})
  let lastEventID = undefined
  for (const event of events) {
    lastEventID = `${event.meta.stream}.${event.meta.id}`
    await each(event)
  }
  return lastEventID
}
