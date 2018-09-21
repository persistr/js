module.exports = async function(http, { identity, space, domain, stream, event }) {
  let { body: event } = await http.get({ identity, endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events/${event}` })
  return event
}
