module.exports = async function(store, { identity, db, ns, stream, event }) {
  const index = store.index.events[`${db}.${ns}.${stream}.${event}`]
  return store.events[index]
}
