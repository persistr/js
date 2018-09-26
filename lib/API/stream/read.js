module.exports = async function(http, { space, domain, stream, after, until, each }) {
  const { body: events } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events`, query: { after, until }})
  events.forEach(each)
}
