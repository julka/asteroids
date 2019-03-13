const mixin = {
  methods: {
    getAllForUser (username) {
      const searchParams = new URLSearchParams()
      searchParams.append('username', username)
      const getParams = searchParams.toString()
      const url = `http://localhost:3001/neos?${getParams}`

      return fetch(
        url,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

export default mixin
