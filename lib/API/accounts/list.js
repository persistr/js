module.exports = async function(http, { each }) {
  const { body: accounts } = await http.get({ endpoint: `/accounts` })
  for (const account of accounts) {
    await each(account)
  }
}
