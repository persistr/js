module.exports = async function(http, { identity, space }) {
  await http.delete({ identity, endpoint: `/spaces/${space}` })
}
