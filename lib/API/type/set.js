module.exports = async function(http, { space, domain, spec }) {
  await http.put({ endpoint: `/spaces/${space}/domains/${domain}/types/${spec.name}`, body: spec })
}
