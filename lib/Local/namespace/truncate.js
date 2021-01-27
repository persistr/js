const filter = require('../../utils/filter')
module.exports = async function(store, { db, ns }) {
  store.events = store.events.filter(event => event.meta.db !== db || event.meta.ns !== ns)
  store.index.events = filter(store.index.events, `${db}.${ns}.`)
}
