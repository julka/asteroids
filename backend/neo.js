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

neo.create = function (neoId, note, username, db) {
  return neo.collection(db).findOne({ neoId, username }).then((result) => {
    if (result) {
      return Promise.reject(new Error('Entity exists'))
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
  })
}

neo.update = function (neoId, note, username, db) {
  console.log({neoId, note, username, db})
  const filter = { neoId, username }
  const update = {
    note,
    edited: Math.floor(Date.now() / 1000)
  }
  return neo.collection(db).findOne(filter).then((result) => {
    console.log({result})
    if (!result) {
      return Promise.reject(new Error('Entity does not exist'))
    } else {
      return neo.collection(db).updateOne(filter, { $set: update })
    }
  })
}

neo.createDocument = function (neoDoc, db) {
  return neo.collection(db).insertOne(neoDoc)
}

neo.collection = function (db) {
  return db.collection('neos')
}

module.exports = neo
