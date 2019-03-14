import { api } from '../../env.js'
const apiUrl = `${api.baseUrl}:${api.port}`

const mixin = {
  methods: {
    createUser (username, password) {
      const url = `${apiUrl}/user`
      return fetch(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        }
      )
    },
    loginUser (username, password) {
      const url = `${apiUrl}/login`
      return fetch(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        }
      )
    }
  }
}

export default mixin
