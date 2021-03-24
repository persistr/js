module.exports = async function(http, { identity, db, cursor }) {
  const { body } = await http.get({ identity, endpoint: `/db/${db}/cursors/${cursor}` })
  return body
}
