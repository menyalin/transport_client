<template>
  <div>
    <v-autocomplete
      :label="label"
      :items="items"
      :value="value"
      clearable
      :append-icon="appendIcon"
      @change="change"
      @click:append="appendClick"
    />
    <v-dialog
      v-model="dialog"
      max-width="850"
    >
      <v-card class="pa-3">
        <slot
          name="form"
          @cancel="cancelHandler"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'Autocomplete',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String,
    label: String,
    itemsGetter: String,
  },
  data() {
    return { dialog: false }
  },
  computed: {
    items() {
      return this.$store.getters[this.itemsGetter]
    },
    appendIcon() {
      return this.value ? 'mdi-pencil' : 'mdi-plus-circle'
    },
  },
  mounted() {
    this.$on('cancel', () => {
      console.log('cancel')
    })
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    },
    appendClick() {
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    cancelHandler() {
      console.log('cancel')
      this.dialog = false
    },
  },
}
</script>
<style></style>
