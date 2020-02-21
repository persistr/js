module.exports = async function(store, { each }) {
  const spaces = store.events
    .map(event => event.meta.space)
    .sort()
    .filter((item, pos, ary) => !pos || item !== ary[pos - 1])
  for (const space of spaces) {
    await each(space)
  }
}
