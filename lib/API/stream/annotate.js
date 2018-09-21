module.exports = async function(http, { space, domain, stream, annotation }) {
  await http.put({ endpoint: `/spaces/${space}/domains/${domain}/streams/${stream}/annotation`, body: annotation })
}
