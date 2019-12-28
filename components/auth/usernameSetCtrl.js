const config = require('config')
const { AppError, createAuthToken } = require('chatz-lib')

const secret = config.get('app.secret')

/**
 * Controller for setting user's name.
 * @returns {Function}
 */
module.exports = function setUsername () {
  return function setUsernameController (req, res, next) {
    if (!req.body || !req.body.username) {
      return next(new AppError('Bad Request', true, 400))
    }
    const name = String(req.body.username)
    const token = createAuthToken(name, secret)
    res.send({ token })
  }
}
