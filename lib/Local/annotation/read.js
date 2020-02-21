module.exports = async function(store, { space, domain, stream }) {
  return store.annotations[`${space}.${domain}.${stream}`]
}
