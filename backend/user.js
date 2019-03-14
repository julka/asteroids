const bcrypt = require('bcrypt')
const uuid = require('node-uuid')
const env = require('../env')

const user = {}

user.findByUsername = async (username, db) => {
  try {
    const userDoc = await user.collection(db).findOne({ username })
    return userDoc ? sanitize(userDoc) : userDoc
  } catch (error) {
    throw error
  }
}

user.create = async (username, password, db) => {
  try {
    const salt = await bcrypt.genSalt(env.saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const userDoc = {
      username,
      salt,
      hash,
      token: uuid(),
      created: Math.floor(Date.now() / 1000)
    }
    await user.createDocument(userDoc, db)
    return user.authenticatePassword(username, password, db)
  } catch (error) {
    throw error
  }
}

user.authenticatePassword = async (username, password, db) => {
  try {
    const userDoc = await findByUsernameUnsanitized(username, db)
    if (!userDoc) {
      throw new Error('User does not exist')
    } else {
      const hash = await bcrypt.hash(password, userDoc.salt)
      if (hash !== userDoc.hash) {
        throw new Error('Wrong password')
      } else {
        return sanitize(userDoc)
      }
    }
  } catch (error) {
    throw error
  }
}

user.authenticateToken = async (username, token, db) => {
  try {
    const userDoc = await user.collection(db).findOne({ username, token })
    if (userDoc) {
      return sanitize(userDoc)
    } else {
      throw new Error('Bad authentication')
    }
  } catch (error) {
    throw error
  }
}

user.createDocument = async (userDoc, db) => {
  try {
    const result = await user.collection(db).insertOne(userDoc)
    return result.ops
  } catch (error) {
    throw error
  }
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
