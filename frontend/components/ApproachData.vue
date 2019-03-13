<template>
  <div>
    <p>{{ dateTime }}</p>
    <p>{{ value.relative_velocity.miles_per_hour }}/mph</p>
    <p>{{ value.miss_distance.miles }} miles from Earth</p>
    <p>Orbiting body: {{ value.orbiting_body }}</p>
  </div>
</template>
<script>

const component = {
  props: {
    value: Object
  },
  computed: {
    dateTime () {
      return (new Date(this.value.epoch_date_close_approach)).toLocaleString()
    }
  }
}

export default component
</script>
