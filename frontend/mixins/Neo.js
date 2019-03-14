import { api } from '../../env.js'
const apiUrl = `${api.baseUrl}:${api.port}`

const mixin = {
  methods: {
    getAllNeoNotesForUser (username, token) {
      const url = `${apiUrl}/neos`
      return fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': token,
            'X-API-ID': username
          }
        }
      )
    },
    addNeoNoteForUser (neoId, note, username, token) {
      const url = `${apiUrl}/neos/${neoId}`
      return fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': token,
            'X-API-ID': username
          },
          body: JSON.stringify({note})
        }
      )
    },
    updateNeoNoteForUser(neoId, note, username, token) {
      const url = `${apiUrl}/neos/${neoId}`
      return fetch(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': token,
            'X-API-ID': username
          },
          body: JSON.stringify({note})
        }
      )
    }
  }
}

export default mixin
