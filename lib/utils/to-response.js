module.exports = function(promise) {
  return promise.then(res => {
    return [null, res.body, res]
  })
  .catch(err => [err])
}
