module.exports = async function(http, { db, ns, from, after, to, until, types, limit, each }) {
  const { body: results } = await http.get({ endpoint: `/db/${db}/ns/${ns}/events`, query: { types, from, after, to, until, limit, schema: 'jsonapi' }})
  for (const event of results.data) {
    await each(event)
  }
  if (results.meta.cursor) {
    return results.meta.cursor.after
  }
}
