module.exports = async function(http, { db, cursor }) {
  await http.post({ endpoint: `/db/${db}/cursors/${cursor}/rewind` })
}
