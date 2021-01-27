module.exports = async function(store, { db, each }) {
  const namespaces = store.events
    .filter(event => event.meta.db === db)
    .map(event => event.meta.ns)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const ns of namespaces) {
    await each(ns)
  }
}
