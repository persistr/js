module.exports = async function(http, { from, to }) {
  await http.post({ endpoint: `/spaces?rename=${from}&to=${to}` })
}
