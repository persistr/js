module.exports = async function(http, { name, src }) {
  await http.put({ endpoint: `/functions/${name}`, body: src, headers: {
    'content-type': 'text/domainmodel'
  }})
}
