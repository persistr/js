module.exports = async function(http, { identity, db }) {
  await http.delete({ identity, endpoint: `/db/${db}` })
}
