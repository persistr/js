module.exports = async function(http, { name, username, password }) {
  return await http.post({ endpoint: `/accounts/${username}`, body: { name, password }})
}
