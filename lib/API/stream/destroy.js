module.exports = async function(http, { space, domain, stream }) {
  await http.delete({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}` })
}
