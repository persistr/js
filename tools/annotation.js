// Run this script via npm:
// npm run annotation

// Read sensitive data like the secret Persistr API key from a local .env file.
require('dotenv').config()

// Dependencies
const { persistr } = require('../lib/persistr')
const uuidv4 = require('uuid/v4')

async function main() {
  // Display usage and exit, if required command-line arguments are not present.
  if (process.argv.length != 5) {
    console.log('Usage: npm run annotation SPACE DOMAIN STREAM')
    return
  }

  // Read command-line arguments.
  const spaceID = process.argv[2]
  const domainID = process.argv[3]
  const streamID = process.argv[4]

  // Authenticate with Persistr using an API key. You must have an active Persistr
  // account. Grab your API key from your account details.
  const account = await persistr.account({ credentials: { apikey: process.env.PERSISTR_API_KEY }})

  const space = await account.space(spaceID)
  const domain = await space.domain(domainID)
  const stream = await domain.stream(streamID)

  // Obtain the most recent snapshot. Or if no snapshot exists, initialize new bank account.
  let annotation = await stream.annotation().read()
  console.log(annotation)
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
