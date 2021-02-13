module.exports = async function(http, { username }) {
  const { body } = await http.get({ endpoint: `/accounts/${username}` })
  return body
}
