module.exports = async function(store, { name, src }) {
  store.functions[name] = src
}
