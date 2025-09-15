<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-wrapper">
      <template v-if="truckType === 'truck'">
        <v-text-field
          label="Осаго №"
          :model-value="params.osagoNum"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="change($event, 'osagoNum')"
        />
        <DateTimeInput
          label="Дата окончания"
          :value="params.osagoExpDate"
          hide-prepend-icon
          hide-time-input
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="change($event, 'osagoExpDate')"
        />
        <v-text-field
          label="Страховая компания"
          :model-value="params.osagoCompany"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="change($event, 'osagoCompany')"
        />
      </template>
      <v-text-field
        label="Каско №"
        :model-value="params.kaskoNum"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="change($event, 'kaskoNum')"
      />
      <DateTimeInput
        label="Дата окончания"
        :value="params.kaskoExpDate"
        hide-prepend-icon
        hide-time-input
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="change($event, 'kaskoExpDate')"
      />
      <v-text-field
        label="Страховая компания"
        :model-value="params.kaskoCompany"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="change($event, 'kaskoCompany')"
      />
      <v-text-field
        label="Лизинговая компания"
        :model-value="params.leasingСompany"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="change($event, 'leasingСompany')"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'Insurance',
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
        osagoNum: null,
        osagoExpDate: null,
        osagoCompany: null,
        kaskoNum: null,
        kaskoExpDate: null,
        kaskoCompany: null,
        leasingСompany: null,
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
  grid-template-columns: 220px 200px 220px 220px 200px 220px 220px;
  margin-bottom: 20px;
}
</style>
