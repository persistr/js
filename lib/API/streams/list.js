module.exports = async function(http, { space, domain, each }) {
  let { body: streams } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams` })
  streams.forEach(each)
}
