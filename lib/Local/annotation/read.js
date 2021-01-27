module.exports = async function(store, { db, ns, stream }) {
  return store.annotations[`${db}.${ns}.${stream}`]
}
