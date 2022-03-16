module.exports = async function(http, { db, id }) {
  try {
    const { body: object } = await http.get({ endpoint: `/db/${db}/objects/${id}` })
    return object
  }
  catch (error) {
    if (error && error.statusCode === 404) return undefined
    if (error) throw error
  }
}
