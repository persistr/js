module.exports = async function(http, { db, ns, stream }) {
  try {
    const { body: annotation } = await http.get({ endpoint: `/db/${db}/ns/${ns}/streams/${stream}/annotation` })
    return annotation
  }
  catch (error) {
    if (error && error.statusCode === 404) return undefined
    if (error) throw error
  }
}
