const bcrypt = require('bcrypt')
const uuid = require('node-uuid')
const env = require('../env')

const user = {}

user.findByUsername = function (username, db) {
  return user.collection(db).findOne({ username }).then((userDoc) => {
    return userDoc ? sanitize(userDoc) : userDoc
  })
}

user.create = function (username, password, db) {
  return bcrypt.genSalt(env.saltRounds).then((salt) => {
    return bcrypt.hash(password, salt).then((hash) => {
      const userDoc = {
        username,
        salt,
        hash,
        token: uuid(),
        created: Math.floor(Date.now() / 1000)
      }
      return user.createDocument(userDoc, db).then(() => {
        return user.authenticatePassword(username, password, db)
      })
    })
  })
}

user.authenticatePassword = function (username, password, db) {
  return findByUsernameUnsanitized(username, db).then((userDoc) => {
    if (!userDoc) {
      return Promise.reject(new Error('User does not exist'))
    } else {
      return bcrypt.hash(password, userDoc.salt).then((hash) => {
        if (hash !== userDoc.hash) {
          return Promise.reject(new Error('Wrong password'))
        } else {
          return sanitize(userDoc)
        }
      })
    }
  })
}

user.authenticateToken = function (username, token, db) {
  return user.collection(db).findOne({ username, token }).then((userDoc) => {
    if (userDoc) {
      return sanitize(userDoc)
    } else {
      return Promise.reject(new Error('Bad authentication'))
    }
  })
}

user.createDocument = function (userDoc, db) {
  return user.collection(db).insertOne(userDoc).then((result) => {
    return result.ops
  })
}

user.collection = function (db) {
  return db.collection('users')
}

function findByUsernameUnsanitized (username, db) {
  return user.collection(db).findOne({ username })
}

function sanitize (userDoc) {
  return {
    username: userDoc.username,
    created: userDoc.created,
    token: userDoc.token
  }
}

module.exports = user
