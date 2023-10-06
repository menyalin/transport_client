<template>
  <div id="wrapper">
    <v-text-field
      ref="first_field"
      v-model.number="tmpItem.percentOfTariff"
      label="Процент от базового тарифа"
      type="number"
      dense
      outlined
      hide-details
    />
  </div>
</template>
<script>
export default {
  name: 'ReturnTariffType',
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
  },
  data() {
    return {
      tmpItem: {
        percentOfTariff: null,
      },
    }
  },

  watch: {
    item: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpItem = val
      },
    },
    tmpItem: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    focus() {
      this.$refs.first_field.focus()
    },
  },
}
</script>
<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
