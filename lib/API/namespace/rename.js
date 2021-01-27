module.exports = async function(http, { db, ns, to }) {
  await http.post({ endpoint: `/db/${db}/ns/${ns}/rename?to=${to}` })
}
