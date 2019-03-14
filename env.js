
module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017',
    dbName: 'asteroids'
  },
  saltRounds: 10,
  api: {
    port: 3001,
    baseUrl: 'http://localhost'
  },
  ui: {
    port: 8080,
    baseUrl: 'http://localhost'
  },
  nasaApiKey: 'secret'
}
