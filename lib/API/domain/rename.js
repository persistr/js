module.exports = async function(http, { space, from, to }) {
  await http.post({ endpoint: `/spaces/${space}/domains?rename=${from}&to=${to}` })
}
