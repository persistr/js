module.exports = async function(http, { space, domain, name, spec }) {
  await http.put({ endpoint: `/spaces/${space}/domains/${domain}/types/${name}`, body: spec })
}
