module.exports = async function(http, { space, domain, each }) {
  const { body: streams } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams` })
  for (const stream of streams) {
    await each(stream)
  }
}
