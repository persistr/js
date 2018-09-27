// This example demonstrates how to authenticate and obtain account details.

// Read sensitive data like the secret Persistr API key from a local .env file.
require('dotenv').config()

// Dependencies
const { persistr } = require('../lib/persistr')
const uuidv4 = require('uuid/v4')

async function main() {
  // Authenticate with Persistr using your account email and password.
  // Then display account details.
  console.log('Authenticating with account email and password:')
  let account = await persistr.account({ credentials: { email: 'demo@demo.com', password: 'demo' }})
  console.log(await account.details())

  // Authenticate with Persistr using an API key. You must have an active Persistr
  // account. Grab your API key from your account details.
  console.log('Authenticating with account API key:')
  account = await persistr.account({ credentials: { apikey: process.env.PERSISTR_API_KEY }})
  console.log(await account.details())
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
