const supertest = require('supertest')
const httpMocks = require('node-mocks-http')
const appInit = require('../app')
const handleCtrlErr = require('../app/handlers/controllerError')
const {
  initLogger,
  createErrorHandler,
  initMongoose
} = require('chatz-lib')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { EventEmitter } = require('events')

describe('app', () => {
  let app, server, request, db, mongod

  before(async () => {
    mongod = new MongoMemoryServer()
    const dbUrl = await mongod.getConnectionString()
    db = await initMongoose({ dbUrl })
    const logger = initLogger('test', {})
    const errHandler = createErrorHandler({ logger })
    app = await appInit({ logger, db, errHandler })
    server = app.listen()
    request = supertest.agent(server)
  })

  after(async () => {
    server.close()
    await db.close()
    await mongod.stop()
  })

  it('Should fail when intied without options', (done) => {
    appInit()
      .catch((err) => {
        expect(err.message).to.equal('Required options not provided')
        done()
      })
  })

  it('Not found should return 404', (done) => {
    request
      .get('/not-exist')
      .expect(404, done)
  })

  it('No user in session should return 401', (done) => {
    request
      .get('/api/messages/fetch')
      .expect(401, done)
  })

  it('Should send token with existing username', (done) => {
    const username = 'test123'
    request
      .post('/api/login')
      .send({ username })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body.user.name).to.equal(username)
        expect(res.body.token).to.be.a('string')
        done()
      })
  })

  it('Should send messsage to user if error in controller', (done) => {
    const err = new Error('Test error')

    const errorHandler = {
      handle: () => {}
    }

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/test/endpoint'
    })

    const res = httpMocks.createResponse({ eventEmitter: EventEmitter })

    res.on('end', () => {
      const { error } = res._getData()
      expect(error).to.equal('Something went wrong')
      done()
    })

    handleCtrlErr(errorHandler)(err, req, res)
  })
})
