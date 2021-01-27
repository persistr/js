module.exports = async function(http, { db, to }) {
  await http.post({ endpoint: `/db/${db}/rename?to=${to}` })
}
