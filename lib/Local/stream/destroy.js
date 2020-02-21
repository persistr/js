const filter = require('../../utils/filter')
module.exports = async function(store, { space, domain, stream }) {
  store.events = store.events.filter(event => event.meta.space !== space || event.meta.domain !== domain || event.meta.stream !== stream)
  store.index.events = filter(store.index.events, `${space}.${domain}.${stream}.`)
}
