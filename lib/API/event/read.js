module.exports = async function(http, { identity, space, domain, stream, event }) {
  let { body } = await http.get({ identity, endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events/${event}` })
  return body
}
