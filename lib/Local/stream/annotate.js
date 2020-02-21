module.exports = async function(store, { space, domain, stream, annotation }) {
  store.annotations[`${space}.${domain}.${stream}`] = annotation
}
