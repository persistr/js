module.exports = async function(store, { space, each }) {
  const domains = store.events
    .filter(event => event.meta.space === space)
    .map(event => event.meta.domain)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const domain of domains) {
    await each(domain)
  }
}
