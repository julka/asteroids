const bcrypt = require('bcrypt')
const env = require('../env')

const user = {}

user.findByUsername = function (username, db) {
  return user.find({ username }, db)
}

user.create = function (username, password, db) {
  return user.generateSalt().then((salt) => {
    return user.generateHash(password, salt).then((hash) => {
      return user.createDocument(
        {
          username,
          salt,
          hash,
          created: Math.floor(Date.now() / 1000)
        },
        db
      )
    })
  })
}

user.createDocument = function (userDoc, db) {
  return new Promise((resolve, reject) => {
    return user.collection(db).insertOne(userDoc, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

user.generateSalt = function() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(env.saltRounds, (error, salt) => {
      if (error) {
        reject(error)
      } else {
        resolve(salt)
      }
    })
  })
}

user.generateHash = function(password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (error, hash) => {
      if (error) {
        reject(error)
      } else {
        resolve(hash)
      }
    })
  })
}

user.collection = function (db) {
  return db.collection('users')
}

user.find = function (search, db) {
  return new Promise((resolve, reject) => {
    user.collection(db).find(search).toArray((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = user;