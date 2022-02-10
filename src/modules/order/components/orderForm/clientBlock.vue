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
      <v-autocomplete
        v-model="params.agreement"
        label="Соглашение"
        dense
        :items="agreements"
        item-value="_id"
        item-text="name"
        outlined
        :loading="loading"
        :error-messages="errorMessage"
        append-icon="mdi-autorenew"
        @click:append="getAgreements"
      />
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
          this.agreements.push(await service.getById(val.agreement))
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
        await this.getAgreements()
      },
    },
    routeDate: async function () {
      this.params.agreement = null
      await this.getAgreements()
    },
  },
  methods: {
    async getAgreements() {
      this.clearAgreements()
      if (!this.routeDate || !this.params.client) return null

      try {
        this.loading = true
        this.agreements = await service.getForOrder({
          company: this.$store.getters.directoriesProfile,
          date: this.routeDate,
          client: this.params.client,
        })
        this.loading = false
        if (this.agreements.length === 1)
          this.params.agreement = this.agreements[0]._id
        this.agreements.forEach((a) => {
          if (a.type === 'default') {
            this.params.agreement = a._id
          }
        })
      } catch (e) {
        this.loading = false
        this.errorMessage = e.message
      }
    },
    clearAgreements() {
      this.params.agreement = null
      this.agreements = []
    },
  },
}
</script>
<style scoped>
.client-block {
  display: grid;
  grid-template-columns: 230px 180px auto;
  margin: 10px;
  grid-gap: 15px;
}
</style>
