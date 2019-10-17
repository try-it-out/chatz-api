const { AppError } = require('chatz-lib')

/**
 * Controller for setting user's name.
 * @returns {Function}
 */
module.exports = function setUsername () {
  return function setUsernameController (req, res, next) {
    if (!req.session) {
      return next(new AppError('No session defined', true))
    }
    if (!req.body || !req.body.username) {
      return next(new AppError('Bad Request', true, 400))
    }
    const username = req.session.username = String(req.body.username)
    res.send({ username })
  }
}
