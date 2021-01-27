module.exports = async function(store, { each }) {
  const databases = store.events
    .map(event => event.meta.db)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const db of databases) {
    await each(db)
  }
}
