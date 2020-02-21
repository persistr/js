module.exports = async function(store, { space, domain, spec }) {
  store.types[`${space}.${domain}.${spec.name}`] = spec
}
