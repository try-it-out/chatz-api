const setUsername = require('../../components/auth/usernameSetCtrl')
const httpMocks = require('node-mocks-http')

describe('auth - usernameSetCtrl', () => {
  it('should set new username and send it back', (done) => {
    const testUsername = 'Test Username'
    const session = {}
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username',
      session,
      body: {
        username: testUsername
      }
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { username } = response._getData()
      expect(username).to.equal(testUsername)
      expect(session.username).to.equal(testUsername)
      done()
    })

    setUsername({})(request, response)
  })

  it('should fail if no data', (done) => {
    const testUsername = 'Test Username'
    const session = { username: testUsername }
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username',
      session,
      body: {}
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    function onError (err) {
      expect(err).to.exist
      expect(err.message).to.equal('Bad Request')
      done()
    }

    setUsername({})(request, response, onError)
  })

  it('should fail if no session initiated', (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username'
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    function onError (err) {
      expect(err).to.exist
      expect(err.message).to.equal('No session defined')
      done()
    }

    setUsername({})(request, response, onError)
  })
})
