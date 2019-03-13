const apiKey = 'secret'

function getNasaApiSearchParams () {
  const searchParams = new URLSearchParams()
  searchParams.append('api_key', apiKey)
  return searchParams
}

const mixin = {
  methods: {
    getNearEarthObjects (startDate, endDate) {
      const searchParams = getNasaApiSearchParams()
      searchParams.append('start_date', startDate)
      searchParams.append('end_date', endDate)
      const getParams = searchParams.toString()
      const url = `https://api.nasa.gov/neo/rest/v1/feed?${getParams}`
      return fetch(url, { method: 'GET' }).then((response) => response.json())
    }
  }
}

export default mixin
