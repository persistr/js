const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(http, { db, id, data }) {
  await http.put({ endpoint: `/db/${db}/objects/${id}`, body: data })
}
