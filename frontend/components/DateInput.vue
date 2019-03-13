<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :value="value"
        :label="label"
        :rules="rules"
        prepend-icon="event"
        readonly
        v-on="on"
        @input="setDate"
      />
    </template>
    <v-date-picker
      :value="value"
      @input="setDate"
    />
  </v-menu>
</template>

<style>

</style>

<script>
const component = {
  props: {
    value: String,
    label: String,
    rules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showMenu: false
    }
  },
  methods: {
    setDate (newValue) {
      this.showMenu = false;
      this.$emit("input", newValue);
    }
  }
}

export default component
</script>
