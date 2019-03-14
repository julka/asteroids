<template>
  <v-card
    class="mx-auto"
    dark
    max-width="400"
  >
    <v-card-title>
      <span class="display-2 font-weight-bold">{{ neo.name }}</span>
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
        Estimated diameter in miles: {{ neo.estimated_diameter.miles.estimated_diameter_min }} x {{ neo.estimated_diameter.miles.estimated_diameter_max }}
      </p>
      <div class="font-weight-bold">
        Closest approach during timeframe
      </div>
      <approach-data :value="neo.closest_approach_data" />

      <v-textarea
        v-show="showNote"
        outline
        label="Observation note"
        v-model="localValue"
        :readonly="readonly"
      />
    </v-card-text>

    <v-card-actions>
      <v-list-tile class="grow">
        <v-layout
          align-center
          justify-end
        >
          <a :href="neo.nasa_jpl_url">
            <v-icon class="mr-1">
              link
            </v-icon>
            <span class="subheading mr-2">nasa.gov</span>
          </a>

          <span class="mr-1">·</span>

          <span
            v-show="readonly && !showNote"
            @click="toggleNote"
          >
            <v-icon class="mr-1">
              expand_more
            </v-icon>
            <span class="subheading">Show observation note</span>
          </span>
          <span
            v-show="readonly && showNote"
            @click="toggleNote"
          >
            <v-icon class="mr-1">
              expand_less
            </v-icon>
            <span class="subheading">Hide observation note</span>
          </span>
          <span
            v-show="!readonly && !showNote"
            @click="toggleNote"
          >
            <v-icon class="mr-1">
              create
            </v-icon>
            <span class="subheading" v-show="localValue">Edit observation note</span>
            <span class="subheading" v-show="!localValue">Add observation note</span>
          </span>
          <span
            v-show="!readonly && showNote"
            @click="saveNote"
          >
            <v-icon class="mr-1">
              save
            </v-icon>
            <span class="subheading">Save observation note</span>
          </span>
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
    neo: Object,
    readonly: {
      type: Boolean,
      default: false
    },
    value: String
  },
  data () {
    return {
      showNote: false,
      localValue: this.value
    }
  },
  computed: {
    isHazardous () {
      return this.neo.is_potentially_hazardous_asteroid
    },
    isSentry () {
      return this.neo.is_sentry_object
    }
  },
  methods: {
    toggleNote () {
      if (!this.showNote) {
        this.localValue = this.value
      }
      this.showNote = !this.showNote
    },
    saveNote () {
      this.$emit("input", this.localValue)
      this.toggleNote()
    }
  }
}

export default component
</script>
