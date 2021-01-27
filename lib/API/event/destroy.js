module.exports = async function(http, { db, ns, stream, event }) {
  await http.delete({ endpoint: `/db/${db}/ns/${ns}/streams/${stream}/events/${event}` })
}
