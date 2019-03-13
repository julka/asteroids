<template>
 <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <date-menu-input
          :value="start"
          label="start date"
          :rules="startRules"
          @input="$emit('update:start', $event)"
        />
      </v-flex>
      <v-flex xs6>
        <date-menu-input
          :value="end"
          label="end date"
          :rules="endRules"
          @input="$emit('update:end', $event)"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import DateMenuInput from './DateInput.vue'

const component = {
  components: {
    DateMenuInput
  },
  props: {
    start: String,
    end: String,
    max: Number
  },
  computed: {
    startDateObject () {
      return new Date(this.start)
    },
    endDateObject () {
      return new Date(this.end)
    },
    rangeWidth () {
      return this.endDateObject - this.startDateObject
    },
    maxDaysInSeconds () {
      return this.max * 24 * 60 * 60 * 1000
    },
    startRules () {
      return [this.rangeRule, this.startRule]
    },
    endRules () {
      return [this.rangeRule, this.endRule]
    }
  },
  methods: {
    rangeRule () {
      if (this.rangeWidth > this.maxDaysInSeconds) {
        return `Dates must be within ${this.max} days of each other.`;
      }
      return true;
    },
    startRule () {
      if (this.startDateObject > this.endDateObject) {
        return 'Start date cannot be after end date';
      }
      return true;
    },
    endRule () {
      if (this.startDateObject > this.endDateObject) {
        return 'End date cannot be before start date';
      }
      return true;
    }
  }
}

export default component
</script>
