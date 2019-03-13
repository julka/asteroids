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

app.get('/', (req, res) => {
  res.send('Hello Universe!')
})

app.post('/user', (req, res) => {
  const { username, password } = req.body

  client.connect((error) => {
    if (error) {
      res.status(500).end()
    } else {
      const db = client.db(env.mongo.dbName)
      user.findByUsername(username, db).then((docs) => {
        if (docs.length) {
          // if the username exists send a 409 CONFLICT
          res.status(409).end()
        } else {
          return user.create(username, password, db).then((result) => {
            res.send(JSON.stringify(result))
          })
        }
      }).catch(() => {
        res.status(500).end()
        client.close()
      })
    }
  })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  client.connect((error) => {
    if (error) {
      res.status(500).end()
    } else {
      const db = client.db(env.mongo.dbName)
      user.authenticatePassword(username, password, db).then((result) => {
        res.send(JSON.stringify(result))
      }).catch((error) => {
        if (error.message === 'Wrong password' ||
          error.message === 'User does not exist'
        ) {
          res.status(401).end()
        } else {
          res.status(500).end()
        }
        client.close()
      })
    }
  });
})

app.listen(3001, () => console.log('Server ready'))
