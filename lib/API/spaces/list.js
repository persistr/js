module.exports = async function(http, { each }) {
  let { body: spaces } = await http.get({ endpoint: `/spaces` })
  spaces.forEach(each)
}
