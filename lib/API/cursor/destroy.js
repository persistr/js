module.exports = async function(http, { identity, db, cursor }) {
  await http.delete({ identity, endpoint: `/db/${db}/cursors/${cursor}` })
}
