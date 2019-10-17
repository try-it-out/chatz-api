const mongoose = require('mongoose')
const { AppError } = require('chatz-lib')

const collectionName = 'messages'

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

/**
 * Message Model.
 * @param {Connection} connection - Mongoose connection.
 * @returns {Model}
 */
module.exports = function messageModel (connection) {
  if (!connection) {
    throw new AppError('Connection not defined', true)
  }
  const model = connection.model('Message', messageSchema, collectionName)
  model.__collectionName = collectionName
  return model
}
