const fs = require('fs')
const Mustache = require('mustache')

// Preprocess all error classes contained in this folder and each subfolder.
visit(__dirname)

function visit (folder) {
  fs.readdirSync(folder).forEach(item => {
    const entry = `${folder}/${item}`
    if (fs.statSync(entry).isDirectory()) return visit(entry)
    preprocess(entry)
  })
}

function preprocess (file) {
  // Ignore files not ending in '.template.js'.
  if (!file.endsWith('.template.js')) return

  // Preprocess file.
  const output = file.replace(/\.template\.js$/, '.js')
  const model = file.replace(/\.template\.js$/, '.model.js')
  const factory = require(model)
  fs.writeFileSync(output, Mustache.render(fs.readFileSync(file, "utf8"), factory.model()))
}
