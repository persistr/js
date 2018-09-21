module.exports = async function(http, { identity, space, domain, stream, after, until, each }) {
  const { body: events } = await http.get({ identity, endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events`, query: { after, until }})
  events.forEach(each)
}
