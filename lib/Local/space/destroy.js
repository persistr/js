const filter = require('../../utils/filter')
module.exports = async function(store, { space }) {
  store.events = store.events.filter(event => event.meta.space !== space)
  store.index.events = filter(store.index.events, `${space}.`)
}
