module.exports = async function(http, { space, domain, stream }) {
  const { body: subscriptions } = await http.get({ endpoint: `/subscriptions`, query: { space, domain, stream }})
  return subscriptions
}
