<template>
  <div>
    <AppBlockTitle>{{ title }}</AppBlockTitle>
    <div class="fields-wrapper">
      <template v-if="truckType === 'truck'">
        <v-text-field
          label="Осаго №"
          :modelValue="params.osagoNum"
          variant="outlined"
       density="compact"
         
          hideDetails
          @change="change($event, 'osagoNum')"
        />
        <DateTimeInput
          label="Дата окончания"
          :value="params.osagoExpDate"
          hidePrependIcon
          hideTimeInput
          outlined
          dense
          hideDetails
          @change="change($event, 'osagoExpDate')"
        />
        <v-text-field
          label="Страховая компания"
          :modelValue="params.osagoCompany"
          variant="outlined"
       density="compact"
         
          hideDetails
          @change="change($event, 'osagoCompany')"
        />
      </template>
      <v-text-field
        label="Каско №"
        :modelValue="params.kaskoNum"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'kaskoNum')"
      />
      <DateTimeInput
        label="Дата окончания"
        :value="params.kaskoExpDate"
        hidePrependIcon
        hideTimeInput
        outlined
        dense
        hideDetails
        @change="change($event, 'kaskoExpDate')"
      />
      <v-text-field
        label="Страховая компания"
        :modelValue="params.kaskoCompany"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'kaskoCompany')"
      />
      <v-text-field
        label="Лизинговая компания"
        :modelValue="params.leasingСompany"
        variant="outlined"
       density="compact"
       
        hideDetails
        @change="change($event, 'leasingСompany')"
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
    grid-template-columns: 220px 200px 220px 220px 200px 220px 220px;
    margin-bottom: 20px;
  }
</style>
