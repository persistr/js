module.exports = async function(http, { identity, space }) {
  await http.put({ identity, endpoint: `/spaces/${space}` })
}
