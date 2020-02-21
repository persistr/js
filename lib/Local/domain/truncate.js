const filter = require('../../utils/filter')
module.exports = async function(store, { space, domain }) {
  store.events = store.events.filter(event => event.meta.space !== space || event.meta.domain !== domain)
  store.index.events = filter(store.index.events, `${space}.${domain}.`)
}
