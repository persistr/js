module.exports = async function(http, { identity, db }) {
  await http.put({ identity, endpoint: `/db/${db}` })
}
