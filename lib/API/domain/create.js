module.exports = async function(http, { identity, space, domain }) {
  await http.put({ identity, endpoint: `/spaces/${space}/domains/${domain}` })
}
