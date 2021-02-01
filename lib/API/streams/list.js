module.exports = async function(http, { db, ns, each }) {
  const { body: streams } = await http.get({ endpoint: ns ? `/db/${db}/ns/${ns}/streams` : `/db/${db}/streams` })
  for (const stream of streams) {
    await each(stream)
  }
}
