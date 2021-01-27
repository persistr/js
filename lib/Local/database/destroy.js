const filter = require('../../utils/filter')
module.exports = async function(store, { db }) {
  store.events = store.events.filter(event => event.meta.db !== db)
  store.index.events = filter(store.index.events, `${db}.`)
}
