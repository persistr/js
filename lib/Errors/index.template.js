var Errors = {{{requires}}}

// The following async/await code is replaced with promises
// in order to return a cancelable Bluebird promise. Otherwise,
// async/await will wrap the return value into a native promise,
// losing the ability to cancel the promise.

// Convenience for handling HTTP errors.
/*
Errors.handle = async function (callback) {
  try {
    return await callback()
  } catch (error) {
    if (error instanceof Errors.PersistrError) throw error
    if (error && error.error && error.error.code === 'ECONNREFUSED') throw new Errors.ConnectionRefused()
    throw error
  }
}
*/
Errors.handle = function (callback) {
  return callback()
    .catch(error => {
      if (error instanceof Errors.PersistrError) throw error
      if (error && error.error && error.error.code === 'ECONNREFUSED') throw new Errors.ConnectionRefused()
      throw error
    })
}

module.exports = Errors
