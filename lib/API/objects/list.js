module.exports = async function(http, { space, domain }) {
  const { body } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/objects` })
  return body
}
