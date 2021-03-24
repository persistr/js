module.exports = async function(http, { db, cursor, last }) {
  await http.post({ endpoint: `/db/${db}/cursors/${cursor}/advance`, query: { last }})
}
