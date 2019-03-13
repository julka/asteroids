<template>
  <v-card
    class="mx-auto"
    dark
    max-width="400"
  >
    <v-card-title>
      <span class="display-2 font-weight-bold">{{ value.name }}</span>
    </v-card-title>

    <v-card-text class="headline font-weight-light">
      <p>
        Potential Hazardnous:
        <span v-if="isHazardous">Yes</span>
        <span v-else>No</span>
      </p>

      <p>
        Sentry Object:
        <span v-if="isSentry">Yes</span>
        <span v-else>No</span>
      </p>

      <p>
        Estimated diameter in miles: {{ value.estimated_diameter.miles.estimated_diameter_min }} x {{ value.estimated_diameter.miles.estimated_diameter_max }}
      </p>
      <div class="font-weight-bold">
        Closest approach during timeframe
      </div>
      <approach-data :value="value.closest_approach_data" />
    </v-card-text>

    <v-card-actions>
      <v-list-tile class="grow">
        <v-layout
          align-center
          justify-end
        >
          <a :href="value.nasa_jpl_url">
            <v-icon class="mr-1">
              link
            </v-icon>
            <span class="subheading mr-2">nasa.gov</span>
          </a>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">
            create
          </v-icon>
          <span class="subheading">Add observation note</span>
        </v-layout>
      </v-list-tile>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
a {
  color: #FFFFFF;
  text-decoration: none;
}
</style>

<script>
import ApproachData from './ApproachData.vue'

const component = {
  components: {
    ApproachData
  },
  props: {
    value: Object
  },
  computed: {
    isHazardous () {
      return this.value.is_potentially_hazardous_asteroid
    },
    isSentry () {
      return this.value.is_sentry_object
    }
  }
}

export default component
</script>
