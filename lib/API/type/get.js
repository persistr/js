module.exports = async function(http, { space, domain, name }) {
  const { body: spec } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/types/${name}` })
  return spec
}
