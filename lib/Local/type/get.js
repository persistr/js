module.exports = async function(store, { space, domain, name }) {
  return store.types[`${space}.${domain}.${name}`]
}
