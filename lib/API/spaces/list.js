module.exports = async function(http, { each }) {
  const { body: spaces } = await http.get({ endpoint: `/spaces` })
  for (const space of spaces) {
    await each(space)
  }
}
