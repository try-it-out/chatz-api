const sinon = require('sinon')
const {
  AppError,
  initLogger,
  createErrorHandler
} = require('chatz-lib')
const handleUncaught = require('../../bin/handlers/uncaught')

describe('bin', () => {
  it('Should process.exit on "uncaughtException" if not isTrustedError', (done) => {
    const logger = initLogger('test', {})
    const errHandler = createErrorHandler({ logger })
    const err = new Error('Uncaught Exception')
    sinon.stub(process, 'exit')
    const uncaughtHandler = handleUncaught(errHandler)

    process.exit.callsFake((code) => {
      expect(code).to.equal(1)
      process.exit.restore()
      done()
    })

    uncaughtHandler(err)
  })

  it('Should handle on "uncaughtException" if isTrustedError', () => {
    const logger = initLogger('test', {})
    const errHandler = createErrorHandler({ logger })
    const err = new AppError('Operational error', true)
    const uncaughtHandler = handleUncaught(errHandler)
    uncaughtHandler(err)
  })
})
