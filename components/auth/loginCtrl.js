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
    const name = req.body.username ? req.body.username : `${randomName.first()} ${randomName.last()}`
    const user = { name }
    const token = createAuthToken(name, secret)
    res.send({ token, user })
  }
}
