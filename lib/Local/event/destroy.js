module.exports = async function(store, { space, domain, stream, event }) {
  const index = store.index.events[`${space}.${domain}.${stream}.${event}`]
  delete store.index.events[`${space}.${domain}.${stream}.${event}`]
  delete store.events[index]
}
