module.exports = async function(http, { name, params }) {
  let { body } = await http.post({ endpoint: `/functions/${name}/invoke`, body: params })
  return body
}
