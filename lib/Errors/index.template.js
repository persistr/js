var Errors = {{{requires}}}

// Convenience for handling HTTP errors.
Errors.handle = async function (callback) {
  try {
    return await callback()
  } catch (error) {
    if (error instanceof Errors.PersistrError) throw error
    if (error && error.error && error.error.code === 'ECONNREFUSED') throw new Errors.ConnectionRefused()
    throw error
  }
}

module.exports = Errors
