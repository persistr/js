module.exports = async function(http, { space, domain }) {
  await http.delete({ endpoint: `/spaces/${space}/domains/${domain}` })
}
