module.exports = async function(http, { username }) {
  await http.delete({ endpoint: `/accounts/${username}` })
}
