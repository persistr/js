module.exports = async function(http, { space, domain, stream, type, mutation, params }) {
  await http.post({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/as/${type}/${mutation}`, body: params })
}
