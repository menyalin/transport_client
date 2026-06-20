<template>
  <div>
    <app-block-title>
      {{ title }}
    </app-block-title>
    <div class="fields-wrapper">
      <v-text-field
        label="Пропуск ДЕНЬ, №"
        :model-value="params.dayPermitNumber"
        hide-details
        @change="change($event, 'dayPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :model-value="params.dayPermitExpDate"
        @update:model-value="change($event, 'dayPermitExpDate')"
        hide-details
      />
      <v-text-field
        label="Зона действия"
        :model-value="params.dayPermitZone"
        hide-details
        @change="change($event, 'dayPermitZone')"
      />

      <v-text-field
        label="Пропуск НОЧЬ, №"
        :model-value="params.nightPermitNumber"
        hide-details
        @change="change($event, 'nightPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :model-value="params.nightPermitExpDate"
        @update:model-value="change($event, 'nightPermitExpDate')"
        hide-details
      />
      <v-text-field
        label="Зона действия"
        :model-value="params.nightPermitZone"
        hide-details
        @change="change($event, 'nightPermitZone')"
      />
    </div>
  </div>
</template>
<script>
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
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
