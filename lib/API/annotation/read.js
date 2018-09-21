module.exports = async function(http, { space, domain, stream }) {
  try {
    const { body: annotation } = await http.get({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/annotation` })
    return annotation
  }
  catch (error) {
    if (error && error.statusCode === 404) return undefined
    if (error) throw error
  }
}
