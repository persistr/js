module.exports = async function(http, { identity, db, ns, stream, event }) {
  let { body } = await http.get({ identity, endpoint: `/db/${db}/ns/${ns}/streams/${stream}/events/${event}` })
  return body
}
