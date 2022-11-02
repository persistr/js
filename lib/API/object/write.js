const { DateTime } = require('luxon')
module.exports = async function(http, { db, id, data }) {
  await http.put({ endpoint: `/db/${db}/objects/${id}`, body: data })
}
