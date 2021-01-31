module.exports = async function(http, { db, from, after, to, until, types, limit, each }) {
  const { body: results } = await http.get({ endpoint: `/db/${db}/events`, query: { types, from, after, to, until, limit, schema: 'jsonapi' }})
  for (const event of results.data) {
    await each(event)
  }
  if (results.meta.cursor) {
    return results.meta.cursor.after
  }
}
