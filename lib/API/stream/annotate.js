module.exports = async function(http, { db, ns, stream, annotation }) {
  await http.put({ endpoint: `/db/${db}/ns/${ns}/streams/${stream}/annotation`, body: annotation })
}
