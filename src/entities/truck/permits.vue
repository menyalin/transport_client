<template>
  <div>
    <AppBlockTitle>
      {{ title }}
    </AppBlockTitle>
    <div class="fields-wrapper">
      <v-text-field
        label="Пропуск ДЕНЬ, №"
        :modelValue="params.dayPermitNumber"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'dayPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :value="params.dayPermitExpDate"
        hidePrependIcon
        hideTimeInput
        outlined
        dense
        hideDetails
        @change="change($event, 'dayPermitExpDate')"
      />
      <v-text-field
        label="Зона действия"
        :modelValue="params.dayPermitZone"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'dayPermitZone')"
      />

      <v-text-field
        label="Пропуск НОЧЬ, №"
        :modelValue="params.nightPermitNumber"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'nightPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :value="params.nightPermitExpDate"
        hidePrependIcon
        hideTimeInput
        outlined
        dense
        hideDetails
        @change="change($event, 'nightPermitExpDate')"
      />
      <v-text-field
        label="Зона действия"
        :modelValue="params.nightPermitZone"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'nightPermitZone')"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import { DateTimeInput } from '@/shared/ui'
export default {
  name: 'Permits',
  components: {
    AppBlockTitle,
    DateTimeInput,
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
          this.fields.forEach(f => {
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
