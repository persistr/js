module.exports = async function(store, { db, ns, stream, event }) {
  const index = store.index.events[`${db}.${ns}.${stream}.${event}`]
  delete store.index.events[`${db}.${ns}.${stream}.${event}`]
  delete store.events[index]
}
