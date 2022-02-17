<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="client-block">
      <app-partner-autocomplete
        v-model="params.client"
        label="Клиент"
        outlined
        dense
        only-clients
        hide-details
      />
      <v-text-field
        v-model="params.num"
        hide-details
        outlined
        dense
        label="Номер заказа клиента"
      />
    </div>
    <div
      v-if="loading"
      class="text-caption"
    >
      Загружаю...
    </div>
    <div
      v-else
      class="text-caption"
    >
      {{ agreement ? agreement.name : 'Соглашение отсутствует' }}
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import service from '@/modules/profile/services/agreement.service'

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
    routeDate: String,
  },
  data() {
    return {
      agreements: [],
      agreement: null,
      errorMessage: null,
      loading: false,
      params: {
        client: null,
        num: null,
        agreement: null,
      },
    }
  },
  watch: {
    item: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          this.params.client = val.client
          this.params.num = val.num
          this.params.agreement = val.agreement
        }
        if (val?.agreement) {
          this.agreement = await service.getById(val.agreement)
        }
      },
    },
    params: {
      deep: true,
      handler: function () {
        this.$emit('change', this.params)
      },
    },
    ['params.client']: {
      handler: async function () {
        this.params.agreement = null
        await this.getAgreement()
      },
    },
    routeDate: async function () {
      this.params.agreement = null
      await this.getAgreement()
    },
  },
  methods: {
    async getAgreement() {
      this.clearAgreement()
      if (!this.routeDate || !this.params.client) return null

      try {
        this.loading = true
        this.agreement = await service.getForOrder({
          company: this.$store.getters.directoriesProfile,
          date: this.routeDate,
          client: this.params.client,
        })
        this.params.agreement = this.agreement._id
        this.loading = false
      } catch (e) {
        this.loading = false
        this.errorMessage = e.message
      }
    },
    clearAgreement() {
      this.params.agreement = null
      this.agreement = null
    },
  },
}
</script>
<style scoped>
.client-block {
  display: grid;
  grid-template-columns: 280px 230px;
  margin: 10px;
  gap: 10px;
}
</style>
