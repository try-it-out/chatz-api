const randomName = require('random-name')
const { AppError } = require('chatz-lib')

/**
 * Login controller.
 * @returns {Function}
 */
module.exports = function login () {
  return function loginController (req, res, next) {
    if (!req.session) {
      return next(new AppError('No session defined', true))
    }
    let username
    if (req.session.username) {
      username = req.session.username
    } else {
      username = req.session.username = `${randomName.first()} ${randomName.last()}`
    }
    res.send({ username })
  }
}
