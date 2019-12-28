const login = require('../../components/auth/loginCtrl')
const httpMocks = require('node-mocks-http')
const jwt = require('jsonwebtoken')

describe('auth - loginCtrl', () => {
  it('should send new token', (done) => {
    const request = httpMocks.createRequest({ method: 'POST', url: '/login' })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { token } = response._getData()
      expect(token).to.be.a('string')
      expect(token.length).to.be.above(0)
      const payload = jwt.decode(token)
      expect(payload.name).to.be.a('string')
      done()
    })

    login({})(request, response)
  })

  it('should send token with existing username', (done) => {
    const testUsername = 'Test User'
    const user = { name: testUsername }
    const request = httpMocks.createRequest({ method: 'POST', url: '/login', user })
    const response = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter })

    response.on('end', function () {
      const { token } = response._getData()
      expect(token).to.be.a('string')
      expect(token.length).to.be.above(0)
      const payload = jwt.decode(token)
      expect(payload.name).to.be.equal(testUsername)
      done()
    })

    login({})(request, response)
  })
})
