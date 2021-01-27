module.exports = async function(store, { db, ns, stream }) {
  delete store.annotations[`${db}.${ns}.${stream}`]
}
