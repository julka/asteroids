const neo = {}

neo.findByNeoId = function (neoId, db) {
  return neo.collection(db).findOne({ neoId })
}

neo.findAllByUsername = function (username, db) {
  return new Promise((resolve, reject) => {
    neo.collection(db).find({ username }).toArray((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

neo.create = async (neoId, note, username, db) => {
  try {
    const result = await neo.collection(db).findOne({ neoId, username })
    if (result) {
      throw new Error('Entity exists')
    } else {
      const neoDoc = {
        neoId,
        note,
        username,
        created: Math.floor(Date.now() / 1000),
        edited: Math.floor(Date.now() / 1000)
      }

      return neo.createDocument(neoDoc, db)
    }
  } catch (error) {
    throw error
  }
}

neo.update = async (neoId, note, username, db) => {
  try {
    const filter = { neoId, username }
    const update = {
      note,
      edited: Math.floor(Date.now() / 1000)
    }
    const result = await neo.collection(db).findOne(filter)
    if (!result) {
      throw new Error('Entity does not exist')
    } else {
      return neo.collection(db).updateOne(filter, { $set: update })
    }
  } catch (error) {
    throw error
  }
}

neo.createDocument = function (neoDoc, db) {
  return neo.collection(db).insertOne(neoDoc)
}

neo.collection = function (db) {
  return db.collection('neos')
}

module.exports = neo
