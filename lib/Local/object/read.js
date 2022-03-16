module.exports = async function(store, { db, id }) {
  return store.objects[id]
}
