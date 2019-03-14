const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient

const env = require('../env')
const user = require('./user')
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
  'Wrong password': 401,
  'User does not exist': 401,
  'Bad authentication': 401
}

function handleError(error, res) {
  let httpStatusCode = 500;
  if (errorMessageToHttpStatusCode[error.message]) {
    httpStatusCode = errorMessageToHttpStatusCode[error.message];
  }
  res.status(httpStatusCode).end()
}

app.get('/', (req, res) => {
  res.send('Hello Universe!')
})

app.post('/user', (req, res) => {
  const { username, password } = req.body

  client.connect((error) => {
    if (error) {
      handleError(error, res)
    } else {
      const db = client.db(env.mongo.dbName)
      user.findByUsername(username, db).then((docs) => {
        if (docs.length) {
          // if the username exists send a 409 CONFLICT
          res.status(409).end()
          client.close()
        } else {
          return user.create(username, password, db).then((result) => {
            res.send(JSON.stringify(result))
          })
        }
      }).catch((error) => {
        handleError(error, res)
        client.close()
      })
    }
  })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  client.connect((error) => {
    if (error) {
      handleError(error, res)
    } else {
      const db = client.db(env.mongo.dbName)
      user.authenticatePassword(username, password, db).then((result) => {
        res.send(JSON.stringify(result))
      }).catch((error) => {
        handleError(error, res)
        client.close()
      })
    }
  })
})

app.listen(3001, () => console.log('Server ready'))
