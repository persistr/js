module.exports = async function(store, { space, domain, stream }) {
  delete store.annotations[`${space}.${domain}.${stream}`]
}
