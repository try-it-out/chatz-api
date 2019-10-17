const login = require('../../components/auth/loginCtrl')
const httpMocks = require('node-mocks-http')

describe('auth - loginCtrl', () => {
  it('should send new username', (done) => {
    const session = {}
    const request = httpMocks.createRequest({ method: 'GET', url: '/login', session })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { username } = response._getData()
      expect(username).to.be.a('string')
      expect(username.length).to.be.above(0)
      expect(username).to.be.equal(session.username)
      done()
    })

    login({})(request, response)
  })

  it('should send username from session', (done) => {
    const testUsername = 'Test User'
    const session = { username: testUsername }
    const request = httpMocks.createRequest({ method: 'GET', url: '/login', session })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { username } = response._getData()
      expect(username).to.be.equal(testUsername)
      expect(username).to.be.equal(session.username)
      done()
    })

    login({})(request, response)
  })

  it('should fail if no session initiated', (done) => {
    const request = httpMocks.createRequest({ method: 'GET', url: '/login' })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    function onError (err) {
      expect(err).to.exist
      expect(err.message).to.equal('No session defined')
      done()
    }

    login({})(request, response, onError)
  })
})
