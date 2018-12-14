module.exports = async function(http, { space, to }) {
  await http.post({ endpoint: `/spaces/${space}/rename?to=${to}` })
}
