module.exports = async function(http, { db, id }) {
  await http.delete({ endpoint: `/db/${db}/objects/${id}` })
}
