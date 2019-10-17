/**
 * Middleware for handling errors from controllers.
 * @param {ErrorHandler} errorHandler - instance of ErrorHandler.
 * @returns {Function}
 */
module.exports = function handleControllerError (errorHandler) {
  return (err, req, res, next) => {
    errorHandler.handle(err)
    const httpCode = err.httpCode || 500
    const description = err.description || 'Something went wrong'
    res.status(httpCode).send({ error: description })
  }
}
