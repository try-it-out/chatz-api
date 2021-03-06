const messageFetch = require('../../components/messages/messageFetchCtrl')
const messageModel = require('../../components/messages/messageModel')
const httpMocks = require('node-mocks-http')
const { initMongoose } = require('chatz-lib')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { EventEmitter } = require('events')

describe('messages - messageFetchCtrl', () => {
  let Message, connection, mongod

  before(async () => {
    mongod = new MongoMemoryServer()
    const dbUrl = await mongod.getConnectionString()
    connection = await initMongoose({ dbUrl })
    Message = messageModel(connection)
    await Promise.all([
      Message.create({ text: '123', user: 'asd' }),
      Message.create({ text: '456', user: 'ert' })
    ])
  })

  after(async () => {
    await connection.dropCollection(Message.__collectionName)
    await connection.close()
    await mongod.stop()
  })

  it('should fetch messages from DB', (done) => {
    const name = 'testUser'
    const user = { name }
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/messages/fetch',
      user
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    response.on('end', () => {
      const { result } = response._getData()
      expect(result).to.be.an('array')
      expect(result.length).to.equal(2)
      done()
    })

    messageFetch({ model: Message })(request, response, (err) => { throw err })
  })

  it('should skip 1 message when fetching from DB', (done) => {
    const name = 'testUser'
    const user = { name }
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/messages/fetch',
      user,
      query: {
        skip: 1
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    response.on('end', () => {
      const { result } = response._getData()
      expect(result).to.be.an('array')
      expect(result.length).to.equal(1)
      done()
    })

    messageFetch({ model: Message })(request, response, (err) => { throw err })
  })

  it('should fail if no Model passed to controller', () => {
    expect(messageFetch).to.throw('Message model not defined')
  })

  it('should fail if no user', (done) => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/messages/fetch',
      query: {
        skip: 1
      }
    })

    const response = httpMocks.createResponse({ eventEmitter: EventEmitter })

    function onError (err) {
      expect(err.message).to.equal('Wrong request')
      done()
    }

    messageFetch({ model: Message })(request, response, onError)
  })
})
