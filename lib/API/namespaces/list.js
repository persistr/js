module.exports = async function(http, { db, each }) {
  const { body: namespaces } = await http.get({ endpoint: `/db/${db}/ns` })
  for (const ns of namespaces) {
    await each(ns)
  }
}
