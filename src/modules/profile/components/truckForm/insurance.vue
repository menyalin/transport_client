<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-wrapper">
      <template v-if="truckType === 'truck'">
        <v-text-field
          label="Осаго №"
          :value="params.osagoNum"
          outlined
          dense
          hide-details
          @change="change($event, 'osagoNum')"
        />
        <app-date-time-input
          label="Дата окончания"
          :value="params.osagoExpDate"
          hide-prepend-icon
          hide-time-input
          @change="change($event, 'osagoExpDate')"
        />
        <v-text-field
          label="Страховая компания"
          :value="params.osagoCompany"
          outlined
          dense
          hide-details
          @change="change($event, 'osagoCompany')"
        />
      </template>
      <v-text-field
        label="Каско №"
        :value="params.kaskoNum"
        outlined
        dense
        hide-details
        @change="change($event, 'kaskoNum')"
      />
      <app-date-time-input
        label="Дата окончания"
        :value="params.kaskoExpDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'kaskoExpDate')"
      />
      <v-text-field
        label="Страховая компания"
        :value="params.kaskoCompany"
        outlined
        dense
        hide-details
        @change="change($event, 'kaskoCompany')"
      />
      <v-text-field
        label="Лизинговая компания"
        :value="params.leasingСompany"
        outlined
        dense
        hide-details
        @change="change($event, 'leasingСompany')"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'Insurance',
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
  grid-template-columns: 220px 170px 220px 220px 170px 220px 220px;
  margin-bottom: 20px;
}
</style>
