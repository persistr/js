module.exports = async function(http, { db, ns }) {
  await http.delete({ endpoint: `/db/${db}/ns/${ns}` })
}
