const setUsername = require('../../components/auth/usernameSetCtrl')
const httpMocks = require('node-mocks-http')
const jwt = require('jsonwebtoken')

describe('auth - usernameSetCtrl', () => {
  it('should set new username and send it back', (done) => {
    const testUsername = 'Test Username'
    const user = { name: '123' }
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username',
      user,
      body: {
        username: testUsername
      }
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { token } = response._getData()
      expect(token).to.be.a('string')
      expect(token.length).to.be.above(0)
      const payload = jwt.decode(token)
      expect(payload.name).to.be.equal(testUsername)
      done()
    })

    setUsername({})(request, response)
  })

  it('should fail if no data', (done) => {
    const testUsername = 'Test Username'
    const user = { name: testUsername }
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username',
      user,
      body: {}
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    function onError (err) {
      expect(err.message).to.equal('Bad Request')
      done()
    }

    setUsername({})(request, response, onError)
  })

  it('should fail if no user', (done) => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/username',
      body: {}
    })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    function onError (err) {
      expect(err.message).to.equal('Bad Request')
      done()
    }

    setUsername({})(request, response, onError)
  })
})
