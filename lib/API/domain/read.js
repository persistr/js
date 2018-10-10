module.exports = async function(http, { space, domain, after, until, each }) {
  const { body: events } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/events`, query: { after, until }})
  for (const event of events) {
    await each(event)
  }
}
