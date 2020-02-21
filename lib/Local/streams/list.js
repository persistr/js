module.exports = async function(store, { space, domain, each }) {
  const streams = store.events
    .filter(event => event.meta.space === space && event.meta.domain === domain)
    .map(event => event.meta.stream)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const stream of streams) {
    await each(stream)
  }
}
