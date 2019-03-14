<template>
  <v-app
    id="asteroid"
    dark
  >
    <v-toolbar app>
      <v-toolbar-title>Asteroids!</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-show="!isLoggedIn"
        v-model="username"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="person"
        label="username"
      />
      <v-text-field
        v-show="!isLoggedIn"
        v-model="password"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="vpn_key"
        label="password"
        type="password"
      />
      <v-btn
        v-show="!isLoggedIn"
        :loading="loadingAuth"
        color="info"
        @click="login"
      >
        Login
      </v-btn>
      <v-btn
        v-show="!isLoggedIn"
        :loading="loadingAuth"
        color="info"
        @click="createAccount"
      >
        Create Account
      </v-btn>

      <span v-show="isLoggedIn">{{ username }}</span>
      <v-btn
        v-if="isLoggedIn"
        color="info"
        @click="logout"
      >
        Logout
      </v-btn>

      <v-snackbar
        v-model="snackbar.show"
        :timeout="2000"
        top
      >
        {{ snackbar.text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </v-snackbar>
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
              :loading="loadingNeo"
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
              v-if="nearEarthObject && !loadingNeo"
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
import User from './mixins/User'
import Neo from './mixins/Neo'

const defaultStart = new Date()
const maxDays = 7
const sevenDaysInMs = 1000 * 60 * 60 * 24 * maxDays
const defaultEnd = new Date(defaultStart.getTime() + sevenDaysInMs)

const component = {
  mixins: [
    NasaApi,
    User,
    Neo
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
      loadingNeo: false,
      loadingAuth: false,
      nearEarthObject: null,
      username: '',
      password: '',
      token: false,
      notes: [],
      snackbar: {
        show: false,
        text: 'Hello, Universe'
      }
    }
  },
  computed: {
    isLoggedIn () {
      return Boolean(this.token)
    }
  },
  methods: {
    getNotes () {
      this.getAllForUser(this.username, this.token).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.notes = data
          })
        }
      })
    },
    search () {
      this.loadingNeo = true
      this.getNearestEarthObject(this.start, this.end).then((results) => {
        this.nearEarthObject = results
        this.loadingNeo = false
      })
    },
    login () {
      this.loadingAuth = true
      this.loginUser(this.username, this.password).then((response) => {
        if (response.status === 401) {
          this.snackbar.text = 'Invalid username or password'
          this.snackbar.show = true
          this.loadingAuth = false
        } else if (response.ok) {
          response.json().then((data) => {
            this.setAuth(data.username, data.token)
          })
        }
      })
    },
    logout () {
      this.username = ''
      this.password = ''
      this.token = false
    },
    createAccount () {
      this.loadingAuth = true
      this.createUser(this.username, this.password).then((response) => {
        if (response.status === 409) {
          this.snackbar.text = 'Account already exists'
          this.snackbar.show = true
          this.loadingAuth = false
        } else if (response.ok) {
          response.json().then((data) => {
            this.setAuth(data.username, data.token)
          })
        }
      })
    },
    setAuth (username, token) {
      this.username = username
      this.token = token
      this.password = ''
      this.loadingAuth = false
      this.getNotes()
    }
  }
}

export default component
</script>
