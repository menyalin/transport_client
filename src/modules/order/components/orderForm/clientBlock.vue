<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="client-block">
      <app-partner-autocomplete
        label="Клиент"
        :value="params.client"
        outlined
        dense
        only-clients
        hide-details
        @change="change($event, 'client')"
      />
      <v-text-field
        hide-details
        outlined
        :value="params.num"
        dense
        label="Номер заказа клиента"
        @change="change($event, 'num')"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from './blockTitle.vue'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
export default {
  name: 'ClientBlock',
  components: {
    AppBlockTitle,
    AppPartnerAutocomplete,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    title: String,
  },
  data() {
    return {
      params: {
        client: null,
        num: null,
      },
    }
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.params.client = val.client
          this.params.num = val.num
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
  },
}
</script>
<style scoped>
.client-block {
  display: grid;
  grid-template-columns: 300px 250px;
  margin: 10px;
  grid-gap: 15px;
}
</style>
