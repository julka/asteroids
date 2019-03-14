const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient

const env = require('../env')
const user = require('./user')
const neo = require('./neo')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const client = new MongoClient(env.mongo.url)

var corsOptions = {
  origin: env.api.baseUrl,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

const errorMessageToHttpStatusCode = {
  default: 500,
  'Wrong password': 401,
  'User does not exist': 401,
  'Bad authentication': 401,
  'Entity exists': 409,
  'Entity does not exist': 404
}

function handleError (error, res) {
  let httpStatusCode = errorMessageToHttpStatusCode.default
  if (errorMessageToHttpStatusCode[error.message]) {
    httpStatusCode = errorMessageToHttpStatusCode[error.message]
  }
  res.status(httpStatusCode).end()
}

app.get('/', (req, res) => {
  res.send('Hello Universe!')
})

app.post('/user', (req, res) => {
  const { username, password } = req.body

  client.connect().then(() => {
    const db = client.db(env.mongo.dbName)
    return user.findByUsername(username, db).then((userDoc) => {
      if (userDoc) {
        // if the username exists send a 409 CONFLICT
        res.status(409).end()
      } else {
        return user.create(username, password, db).then((result) => {
          res.send(JSON.stringify(result))
        })
      }
    })
  }).catch((error) => {
    handleError(error, res)
  }).finally(client.close)
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  client.connect().then(() => {
    const db = client.db(env.mongo.dbName)
    return user.authenticatePassword(username, password, db).then((userDoc) => {
      res.send(JSON.stringify(userDoc))
    })
  }).catch((error) => {
    handleError(error, res)
  }).finally(client.close)
})

app.get('/neos', (req, res) => {
  const username = req.headers['x-api-id']
  const token = req.headers['x-api-key']

  client.connect().then(() => {
    const db = client.db(env.mongo.dbName)
    return user.authenticateToken(username, token, db).then(() => {
      return neo.findAllByUsername(username, db).then((result) => {
        res.send(JSON.stringify(result))
      })
    })
  }).catch((error) => {
    handleError(error, res)
  }).finally(client.close)
})

app.post('/neos/:neoId', (req, res) => {
  const { note } = req.body
  const { neoId } = req.params
  const username = req.headers['x-api-id']
  const token = req.headers['x-api-key']

  client.connect().then(() => {
    const db = client.db(env.mongo.dbName)
    return user.authenticateToken(username, token, db).then(() => {
      return neo.create(neoId, note, username, db).then((result) => {
        res.send(JSON.stringify(result))
      })
    })
  }).catch((error) => {
    handleError(error, res)
  }).finally(client.close)
})

app.put('/neos/:neoId', (req, res) => {
  const { note } = req.body
  const { neoId } = req.params
  const username = req.headers['x-api-id']
  const token = req.headers['x-api-key']

  console.log({ note, neoId, username, token})

  client.connect().then(() => {
    const db = client.db(env.mongo.dbName)
    return user.authenticateToken(username, token, db).then(() => {
      return neo.update(neoId, note, username, db).then((result) => {
        res.send(JSON.stringify(result))
      })
    })
  }).catch((error) => {
    handleError(error, res)
  }).finally(client.close)
})

app.listen(3001, () => console.log('Server ready'))
