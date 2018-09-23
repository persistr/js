module.exports = async function(http) {
  const { body } = await http.get({ endpoint: '/accounts/current' })
  return body
}
