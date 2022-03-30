// Dependencies.
const fs = require('fs')

// Register all API endpoints contained in this folder and each subfolder.
let endpoints = []
let methods = []
register(__dirname)

function register (folder) {
  fs.readdirSync(folder).forEach(entry => {
    // Recurse into subfolders.
    const path = `${folder}/${entry}`
    if (fs.statSync(path).isDirectory()) return register(path)

    // Ignore hidden files, files named 'index.js', not ending in '.js', or ending with '.model.js' or '.template.js'.
    const fileName = `${entry}`
    if (fileName.startsWith('.') || fileName === 'index.js' || fileName.endsWith('.template.js') || fileName.endsWith('.model.js') || !fileName.endsWith('.js')) return

    // Extract the name of the subfolder in which the files are located.
    const subfolder = folder.split('/').filter(el => el.trim().length > 0).pop()

    // Register individual API endpoint.
    const endpoint = require(`${path}`)
    const relpath = path.replace(new RegExp(`^${__dirname}`), '.')
    endpoints.push(`${name(subfolder, fileName)}: require('${relpath}')`)

    // The following async/await code is replaced with promises
    // in order to return a cancelable Bluebird promise. Otherwise,
    // async/await will wrap the return value into a native promise,
    // losing the ability to cancel the promise.

/*
    const method = `
  async ${name(subfolder, fileName)} (params) {
    return Errors.handle(async () => endpoints.${name(subfolder, fileName)}(this.store, params))
  }`
*/
    const method = `
  ${name(subfolder, fileName)} (params) {
    return Errors.handle(() => endpoints.${name(subfolder, fileName)}(this.store, params))
  }`
    methods.push(method)
  })
}

function name(folder, file) {
  const noun = folder.charAt(0).toUpperCase() + folder.substr(1)
  const verb = file.replace(/\.js$/, '')
  return `${verb}${noun}`
}

module.exports = {
  model: function() {
    return {
      endpoints: '{\n\t' + endpoints.join(',\n\t') + '\n}',
      methods: methods.join('\n')
    }
  }
}
