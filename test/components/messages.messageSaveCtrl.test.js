const messageSave = require('../../components/messages/messageSaveCtrl')
const messageModel = require('../../components/messages/messageModel')
const httpMocks = require('node-mocks-http')
const { initMongoose } = require('chatz-lib')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { EventEmitter } = require('events')

describe('messages - messageSaveCtrl', () => {
  let Message, connection, collection, mongod

  before(async function () {
    mongod = new MongoMemoryServer()
    const dbUrl = await mongod.getConnectionString()
    connection = await initMongoose({ dbUrl })
    Message = messageModel(connection)
    collection = connection.db.collection(Message.__collectionName)
  })

  after(async function () {
    await connection.dropCollection(Message.__collectionName)
    await connection.close()
    await mongod.stop()
  })

  it('should save message to DB', (done) => {
    const username = 'testUser'
    const testText = 'testable text'
    const user = { name: username }
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/messages/send',
      user,
      body: {
        text: testText
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    response.on('end', function () {
      const { result } = response._getData()
      expect(result.user).to.equal(username)
      expect(result.text).to.equal(testText)
      collection.findOne({ text: testText, user: username }, {}, (err, message) => {
        expect(err).to.be.a('null')
        expect(message.user).to.equal(username)
        expect(message.text).to.equal(testText)
        done()
      })
    })

    messageSave({ model: Message })(request, response, (err) => { throw err })
  })

  it('should fail if no user', (done) => {
    const testText = 'testable text'
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/messages/send',
      body: {
        text: testText
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    function onError (err) {
      expect(err.message).to.equal('Wrong request')
      done()
    }

    messageSave({ model: Message })(request, response, onError)
  })

  it('should fail if no \'text\' param in body', (done) => {
    const username = 'testUser'
    const session = { username }
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/messages/send',
      session
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    function onError (err) {
      expect(err.message).to.equal('Wrong request')
      done()
    }

    messageSave({ model: Message })(request, response, onError)
  })

  it('should fail if no Model passed to controller', () => {
    expect(messageSave).to.throw('Message model not defined')
  })
})
