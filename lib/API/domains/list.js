module.exports = async function(http, { space, each }) {
  let { body: domains } = await http.get({ endpoint: `/spaces/${space}/domains` })
  domains.forEach(each)
}
