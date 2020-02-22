const nodeEval = require('node-eval')
module.exports = async function(store, { name, params }) {
  const src = store.functions[name]
  const fn = nodeEval(src, `./${name}.js`)
  if (fn && typeof(fn) === 'function') return await fn(params)
}
