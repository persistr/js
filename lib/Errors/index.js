const fs = require('fs')

var Errors = {}

// Register all error classes contained in this folder and each subfolder.
const folder = __dirname
register(folder)
fs.readdirSync(folder).forEach(subfolder => {
  const stats = fs.statSync(`${folder}/${subfolder}`)
  if (stats.isDirectory()) {
    register(`${__dirname}/${subfolder}`)
  }
})

function register (subfolder) {
  fs.readdirSync(subfolder).forEach(file => {
    // Ignore subfolders.
    const stats = fs.statSync(`${subfolder}/${file}`)
    if (stats.isDirectory()) {
      return
    }

    // Ignore files named 'index.js' and any not ending in '.js'.
    const fileName = `${file}`
    if (fileName === 'index.js' || !fileName.endsWith('.js')) {
      return
    }

    // Register individual error class.
    var cls = require(`${subfolder}/${file}`)
    Errors[cls.name] = cls
  })
}

// Convenience for handling HTTP errors.
Errors.handle = async function (callback) {
  try {
    return await callback()
  } catch (error) {
    if (error instanceof Errors.PersistrError) throw error
    if (error && error.error && error.error.code === 'ECONNREFUSED') throw new Errors.ConnectionRefused()

    // Unknown error.
    throw new Errors.InternalError(error)
  }
}

module.exports = Errors
