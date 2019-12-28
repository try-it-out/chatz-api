const config = require('config')
const { createAuthToken } = require('chatz-lib')
const randomName = require('random-name')

const secret = config.get('app.secret')

/**
 * Login controller.
 * @returns {Function}
 */
module.exports = function login () {
  return function loginController (req, res, next) {
    const name = (req.user && req.user.name) ? req.user.name : `${randomName.first()} ${randomName.last()}`
    const token = createAuthToken(name, secret)
    res.send({ token })
  }
}
