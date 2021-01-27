module.exports = async function(http, { identity, db, ns }) {
  await http.put({ identity, endpoint: `/db/${db}/ns/${ns}` })
}
