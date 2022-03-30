module.exports = async function(store, { db, id }) {
  delete store.objects[id]
}
