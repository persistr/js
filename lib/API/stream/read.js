module.exports = async function(http, { space, domain, stream, from, after, to, until, types, limit, each }) {
  const { body: results } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/events`, query: { types, from, after, to, until, limit, schema: 'jsonapi' }})
  for (const event of results.data) {
    await each(event)
  }
  if (results.meta.cursor) {
    return results.meta.cursor.after
  }
}
