module.exports = async function(store, { db, id, data }) {
  store.objects[id] = data
}
