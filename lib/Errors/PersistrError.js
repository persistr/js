module.exports = class PersistrError extends Error {
  constructor (message, error) {
    // Call base class constructor.
    super(message + (error ? ` caused by: ${error}` : ''))

    // Save underlying error instance.
    this.error = error

    // Save class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name

    // Capture stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor)
  }
}
