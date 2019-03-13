const bcrypt = require('bcrypt')
const uuid = require('node-uuid')
const env = require('../env')

const user = {}

user.findByUsername = function (username, db) {
  return findByUsernameUnsanitized(username, db).then((docs) => {
    return docs.map(sanitize)
  })
}

user.create = function (username, password, db) {
  return user.generateSalt().then((salt) => {
    return user.generateHash(password, salt).then((hash) => {
      return user.createDocument(
        {
          username,
          salt,
          hash,
          token: uuid(),
          created: Math.floor(Date.now() / 1000)
        },
        db
      ).then(() => {
        return user.authenticatePassword(username, password, db)
      });
    })
  })
}

user.authenticatePassword = function (username, password, db) {
  return new Promise((resolve, reject) => {
    findByUsernameUnsanitized(username, db).then((docs) => {
      if (!docs.length) {
        reject(new Error('User does not exist'))
      } else {
        const userDoc = docs.pop()
        user.generateHash(password, userDoc.salt).then((hash) => {
          if (hash !== userDoc.hash) {
            reject(new Error('Wrong password'))
          } else {
            resolve(sanitize(userDoc))
          }
        })
      }
    })
  })
}

user.authenticateToken = function (username, token, db) {
  return new Promise((resolve, reject) => {
    find({ username, token }, db).then((docs) => {
      if (docs.length) {
        const userDoc = docs.pop()
        resolve(sanitize(userDoc))
      } else {
        reject(new Error('User does not exist'))
      }
    })
  })
}

user.createDocument = function (userDoc, db) {
  return new Promise((resolve, reject) => {
    return user.collection(db).insertOne(userDoc, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result.ops)
      }
    })
  })
}

user.generateSalt = function () {
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

user.generateHash = function (password, salt) {
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

function find (search, db) {
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

function findByUsernameUnsanitized (username, db) {
  return find({ username }, db);
}

function sanitize (userDoc) {
  return {
    username: userDoc.username,
    created: userDoc.created,
    token: userDoc.created
  }
}

module.exports = user
