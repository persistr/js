module.exports = function(object, prefix) {
  let output = {}
  Object.keys(object).filter(key => !key.startsWith(prefix)).forEach(key => {
    output[key] = object[key]
  })
  return output
}
