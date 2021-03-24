module.exports = async function(http, { db, each }) {
  const { body: cursors } = await http.get({ endpoint: `/db/${db}/cursors` })
  for (const cursor of cursors) {
    await each(cursor)
  }
}
