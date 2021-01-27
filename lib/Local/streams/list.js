module.exports = async function(store, { db, ns, each }) {
  const streams = store.events
    .filter(event => event.meta.db === db && event.meta.ns === ns)
    .map(event => event.meta.stream)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const stream of streams) {
    await each(stream)
  }
}
