var Errors = {
	ConnectionRefused: require('./ConnectionRefused.js'),
	Fetch: require('./Fetch.js'),
	InternalError: require('./InternalError.js'),
	InvalidBearerToken: require('./InvalidBearerToken.js'),
	InvalidCredentials: require('./InvalidCredentials.js'),
	PersistrError: require('./PersistrError.js'),
	StatusCode: require('./StatusCode.js'),
	UnsupportedFilter: require('./UnsupportedFilter.js')
}

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
