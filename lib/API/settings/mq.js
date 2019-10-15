module.exports = async function(http) {
  const { body } = await http.get({ endpoint: '/settings/mq' })
  return body
}
