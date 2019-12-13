module.exports = async function(http, { id }) {
  await http.delete({ endpoint: `/subscriptions/${id}` })
}
