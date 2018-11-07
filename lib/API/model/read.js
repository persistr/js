module.exports = async function(http, { space, domain, accept }) {
  const { body } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/model`, headers: { accept }})
  return body
}
