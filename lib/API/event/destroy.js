module.exports = async function(http, { space, domain, stream, event }) {
  await http.delete({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events/${event}` })
}
