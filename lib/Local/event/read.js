module.exports = async function(store, { identity, space, domain, stream, event }) {
  const index = store.index.events[`${space}.${domain}.${stream}.${event}`]
  return store.events[index]
}
