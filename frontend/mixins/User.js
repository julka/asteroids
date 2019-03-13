const mixin = {
  methods: {
    createUser (username, password) {
      const url = 'http://localhost:3001/user'
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
      const url = 'http://localhost:3001/login'
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
