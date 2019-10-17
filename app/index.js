const express = require('express')
const expressWinston = require('express-winston')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('config')
const { AppError } = require('chatz-lib')
const messageModel = require('../components/messages/messageModel')

// Controllers modules
const fetchMessages = require('../components/messages/messageFetchCtrl')
const saveMessage = require('../components/messages/messageSaveCtrl')
const setUsername = require('../components/auth/usernameSetCtrl')
const login = require('../components/auth/loginCtrl')

// Handlers
const handleNotFound = require('./handlers/notFound')
const handleCtrlErr = require('./handlers/controllerError')

/**
 * App initialization.
 * @param {Object} options
 * @param {Connection} options.db - Mongoose Connection.
 * @param {Logger} options.logger - Instance of winston Logger.
 * @param {ErrorHandler} options.errHandler - Instance of ErrorHandler.
 * @returns {Promise}
 */
async function init (options) {
  if (!options || !options.db || !options.logger || !options.errHandler) {
    throw new AppError('Required options not provided', true)
  }
  const app = express()
  const Message = await messageModel(options.db)
  const logger = options.logger
  const errorHandler = options.errHandler

  // Init middlewares
  app.use(expressWinston.logger({ winstonInstance: logger }))
  app.use(session({
    secret: config.get('app.secret'),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: options.db })
  }))

  // Init controllers
  app.get('/api/login', login())
  app.post('/api/username', setUsername())
  app.get('/api/messages/fetch', fetchMessages({ model: Message }))
  app.post('/api/messages/send', saveMessage({ model: Message }))

  // 404 handler
  app.use(handleNotFound())

  // Error handler
  app.use(handleCtrlErr(errorHandler))

  return app
}

module.exports = init
