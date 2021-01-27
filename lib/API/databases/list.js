module.exports = async function(http, { each }) {
  const { body: databases } = await http.get({ endpoint: `/db` })
  for (const db of databases) {
    await each(db)
  }
}
