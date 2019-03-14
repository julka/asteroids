const mixin = {
  methods: {
    getAllForUser (username, token) {
      const url = 'http://localhost:3001/neos'
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
    }
  }
}

export default mixin
