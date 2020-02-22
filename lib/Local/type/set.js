module.exports = async function(store, { space, domain, name, spec }) {
  store.types[`${space}.${domain}.${name}`] = spec
}
