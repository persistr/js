module.exports = async function(http, { identity, db, cursor, options }) {
  await http.post({ identity, endpoint: `/db/${db}/cursors/${cursor}`, body: options })
}
