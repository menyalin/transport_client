<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <app-date-time-input
      label="Сан.паспорт до"
      :value="params.kaskoExpDate"
      hide-prepend-icon
      hide-time-input
      @change="change($event, 'kaskoExpDate')"
    />
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'SanitaryPassport',
  components: {
    AppBlockTitle,
    AppDateTimeInput,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    title: String,
    truckType: String,
  },
  data() {
    return {
      params: {
        exp
      },
    }
  },
  computed: {
    fields() {
      return Object.keys(this.params)
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.fields.forEach((f) => {
            this.params[f] = val[f]
          })
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
    chipColor(days) {
      if (days < 14) return 'error'
      if (days < 30) return 'warning'
      return 'light-green'
    },
  },
}
</script>
<style scoped>
.fields-wrapper {
  display: grid;
  gap: 10px;
  grid-template-columns: 220px 170px 220px 220px 170px 220px 220px;
  margin-bottom: 20px;
}
</style>
