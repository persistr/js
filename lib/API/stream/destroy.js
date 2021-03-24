module.exports = async function(http, { db, ns, stream }) {
  await http.delete({ endpoint: `/db/${db}/streams/${stream}`, query: { ns }})
}
