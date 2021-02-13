module.exports = async function(http, { username }) {
  await http.post({ endpoint: `/accounts/${username}/deactivate` })
}
