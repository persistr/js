// Dependencies.
const fs = require('fs')

// Register all error classes contained in this folder and each subfolder.
let requires = []
register(__dirname)

function register (folder) {
  fs.readdirSync(folder).forEach(entry => {
    // Recurse into subfolders.
    const path = `${folder}/${entry}`
    if (fs.statSync(path).isDirectory()) return register(path)

    // Ignore files named 'index.js', not ending in '.js', or ending with '.model.js' or '.template.js'.
    const fileName = `${entry}`
    if (fileName === 'index.js' || fileName.endsWith('.template.js') || fileName.endsWith('.model.js') || !fileName.endsWith('.js')) return

    // Register individual error class.
    const cls = require(`${path}`)
    const relpath = path.replace(new RegExp(`^${__dirname}`), '.')
    requires.push(`${cls.name}: require('${relpath}')`)
  })
}

module.exports = {
  model: function() {
    return { requires: '{\n\t' + requires.join(',\n\t') + '\n}' }
  }
}
