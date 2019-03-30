module.exports = async function(http, { space, domain, stream, after, until, limit, each }) {
  const { body: events } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events`, query: { after, until, limit }})
  for (const event of events) {
    await each(event)
  }
}
