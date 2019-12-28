const { AppError } = require('chatz-lib')

/**
 * Controller for saving Message to DB.
 * @param {Object} options
 * @param {Model} options.model - Message mongoose model.
 * @returns {Function}
 */
module.exports = function saveMessage (options) {
  options = options || {}
  const Message = options.model
  if (!Message) {
    throw new AppError('Message model not defined', true)
  }
  return async function saveMessageController (req, res, next) {
    try {
      const text = req.body && req.body.text
      const user = req.user && req.user.name
      if (!text || !user) {
        throw new AppError('Wrong request', true)
      }

      const msg = await Message.create({ text, user })
      return res.send({ result: msg })
    } catch (err) {
      return next(err)
    }
  }
}
