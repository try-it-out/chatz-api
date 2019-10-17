module.exports = {
  app: {
    port: 3002,
    secret: 'super-secret'
  },
  mongo: {
    dbUrl: 'mongodb://example-url/',
    config: {}
  },
  log: {
    timestamp: 'YYYY-MM-DD HH:mm:ss'
  }
}
