const { DateTime } = require('luxon')
const uuidv4 = require('uuid/v4')
module.exports = async function(http, { adapter, filter }) {
  await http.post({ endpoint: `/subscriptions`, body: { adapter, filter }})
}
