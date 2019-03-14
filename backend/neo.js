const neo = {}

neo.findByNeoId = function (neoId, db) {
  return find({ neoId }, db)
}

neo.findAllByUsername = function (username, db) {
  return find({ username }, db)
}

neo.create = function (neoId, note, username, db) {
  return new Promise((resolve, reject) => {
    find({ neoId, username }, db).then((docs) => {
      if (docs.length) {
        reject(new Error('Entity exists'))
      } else {
        const neoDoc = {
          neoId,
          note,
          username,
          created: Math.floor(Date.now() / 1000),
          edited: Math.floor(Date.now() / 1000)
        }

        resolve(neo.createDocument(neoDoc, db))
      }
    })
  })
}

neo.update = function (neoId, note, username, db) {
  return new Promise((resolve, reject) => {
    const filter = { neoId, username }
    const update = {
      note,
      edited: Math.floor(Date.now() / 1000)
    }
    find(filter, db).then((docs) => {
      if (!docs.length) {
        reject(new Error('Entity does not exist'))
      } else {
        neo.collection(db).insertOne(filter, update, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      }
    })
  })
}

neo.createDocument = function (neoDoc, db) {
  return new Promise((resolve, reject) => {
    return neo.collection(db).updateOne(neoDoc, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

neo.collection = function (db) {
  return db.collection('neos')
}

function find (search, db) {
  return new Promise((resolve, reject) => {
    neo.collection(db).find(search).toArray((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = neo
