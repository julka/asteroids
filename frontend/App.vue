<template>
  <v-app
    id="asteroid"
    dark
  >
    <v-toolbar app>
      <v-toolbar-title>Asteroids!</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout column>
          <v-flex xs12>
            <date-range-input
              :start.sync="start"
              :end.sync="end"
              :max="max"
            />
          </v-flex>
          <v-flex
            xs12
            class="text-xs-center"
          >
            <v-btn
              :loading="loading"
              @click="search"
            >
              Search
            </v-btn>
          </v-flex>
          <v-flex
            xs12
            mt-4
          >
            <near-earth-object-info
              v-if="nearEarthObject && !loading"
              :value="nearEarthObject"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import DateRangeInput from './components/DateRangeInput.vue'
import NearEarthObjectInfo from './components/NearEarthObjectInfo.vue'
import NasaApi from './mixins/NasaApi'

const defaultStart = new Date()
const maxDays = 7
const sevenDaysInMs = 1000 * 60 * 60 * 24 * maxDays
const defaultEnd = new Date(defaultStart.getTime() + sevenDaysInMs)

const component = {
  mixins: [
    NasaApi
  ],
  components: {
    DateRangeInput,
    NearEarthObjectInfo
  },
  data () {
    return {
      start: defaultStart.toISOString().substring(0, 10),
      end: defaultEnd.toISOString().substring(0, 10),
      max: maxDays,
      loading: false,
      nearEarthObject: null
    }
  },
  methods: {
    search () {
      this.loading = true
      this.getNearestEarthObject(this.start, this.end).then((results) => {
        this.nearEarthObject = results
        this.loading = false
      })
    }
  }
}

export default component
</script>
