import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'

Vue.use(Vuetify)

/* eslint-disable-next-line no-new */
new Vue({
  el: '#asteroid-app',
  render: createElement => createElement(App)
})
