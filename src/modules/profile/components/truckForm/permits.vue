<template>
  <div>
    <app-block-title>
      {{ title }}
    </app-block-title>
    <div class="fields-wrapper">
      <v-text-field
        label="Пропуск ДЕНЬ, №"
        :value="params.dayPermitNumber"
        outlined
        dense
        hide-details
        @change="change($event, 'dayPermitNumber')"
      />
      <app-date-time-input
        label="Действует до"
        :value="params.dayPermitExpDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'dayPermitExpDate')"
      />
      <v-text-field
        label="Зона действия"
        :value="params.dayPermitZone"
        outlined
        dense
        hide-details
        @change="change($event, 'dayPermitZone')"
      />

      <v-text-field
        label="Пропуск НОЧЬ, №"
        :value="params.nightPermitNumber"
        outlined
        dense
        hide-details
        @change="change($event, 'nightPermitNumber')"
      />
      <app-date-time-input
        label="Действует до"
        :value="params.nightPermitExpDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'nightPermitExpDate')"
      />
      <v-text-field
        label="Зона действия"
        :value="params.nightPermitZone"
        outlined
        dense
        hide-details
        @change="change($event, 'nightPermitZone')"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'Permits',
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
        dayPermitNumber: null,
        dayPermitExpDate: null,
        dayPermitZone: null,
        nightPermitNumber: null,
        nightPermitExpDate: null,
        nightPermitZone: null,
        diagnosticCardExpDate: null,
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
  grid-template-columns: 220px 200px 220px 220px 200px 220px;
  margin-bottom: 20px;
}
</style>
