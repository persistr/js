module.exports = async function(http, { name, params }) {
  await http.post({ endpoint: `/functions/${name}/invoke`, body: params })
}
