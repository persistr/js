module.exports = async function(http, { space, domain, stream, type }) {
  let endpoint = `/spaces/${space}/domains/${domain}/objects/${type}`
  if (stream) endpoint += `/${stream}`
  const { body } = await http.get({ endpoint })
  return body
}
