const { AppError } = require('chatz-lib')

/**
 * Controller for fetching Messages from DB.
 * @param {Object} options
 * @param {Model} options.model - Message mongoose model.
 * @returns {Function}
 */
module.exports = function fetchMessages (options) {
  options = options || {}
  const Message = options.model
  if (!Message) {
    throw new AppError('Message model not defined', true)
  }
  return async function fetchMessagesController (req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('Wrong request', true)
      }
      const limit = 25
      const skip = parseInt(req.query.skip) || 0
      const sort = { date: -1 }
      const result = await Message.find({}, null, { sort, limit, skip })
      return res.send({ result })
    } catch (err) {
      return next(err)
    }
  }
}
