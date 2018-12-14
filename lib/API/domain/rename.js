module.exports = async function(http, { space, domain, to }) {
  await http.post({ endpoint: `/spaces/${space}/domains/${domain}/rename?to=${to}` })
}
