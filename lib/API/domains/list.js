module.exports = async function(http, { space, each }) {
  const { body: domains } = await http.get({ endpoint: `/spaces/${space}/domains` })
  for (const domain of domains) {
    await each(domain)
  }
}
