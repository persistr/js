module.exports = async function(store, { db, ns, stream, annotation }) {
  store.annotations[`${db}.${ns}.${stream}`] = annotation
}
