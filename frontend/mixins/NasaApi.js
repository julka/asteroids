import { nasaApiKey } from '../../env.js'

function getNasaApiSearchParams () {
  const searchParams = new URLSearchParams()
  searchParams.append('api_key', nasaApiKey)
  return searchParams
}

function findNearestAppoachingObject (neObjects) {
  let output
  for (const date in neObjects) {
    output = neObjects[date].reduce(
      (nearestSoFar, neObject) => {
        const thisApproach = findNearestApproach(neObject)
        const thatApproach = nearestSoFar && nearestSoFar.closest_approach_data
        if (!nearestSoFar || isCloserApproach(thisApproach, thatApproach)) {
          return { ...neObject, closest_approach_data: thisApproach }
        } else {
          return nearestSoFar
        }
      },
      output
    )
  }
  return output
}

function isCloserApproach (thisApproach, thatApproach) {
  return parseInt(thisApproach.miss_distance.miles) < parseInt(thatApproach.miss_distance.miles)
}

function findNearestApproach (neObject) {
  return neObject.close_approach_data.reduce((nearestSoFar, anotherApproach) => {
    if (nearestSoFar.miss_distance.miles > anotherApproach.miss_distance.miles) {
      return anotherApproach
    } else {
      return nearestSoFar
    }
  })
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
    },
    getNearestEarthObject (startDate, endDate) {
      return this.getNearEarthObjects(this.start, this.end).then((results) => {
        return findNearestAppoachingObject(results.near_earth_objects)
      })
    }
  }
}

export default mixin
