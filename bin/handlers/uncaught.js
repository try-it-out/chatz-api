/**
 * Handler for uncaught errors.
 * @param {ErrorHandler} errorHandler - instance of ErrorHandler.
 * @returns {Function}
 */
module.exports = function handleUncaught (errorHandler) {
  return (err) => {
    errorHandler.handle(err)
    if (!errorHandler.isTrustedError(err)) {
      process.exit(1)
    }
  }
}
