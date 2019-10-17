const messageModel = require('../../components/messages/messageModel')

describe('messages - messageModel', () => {
  it('should fail if no connection passed to messageModel', () => {
    expect(messageModel).to.throw('Connection not defined')
  })
})
