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
        :loading="loading"
        :messages="agreement ? [agreement.name] : ['Соглашение отсутствует']"
        :error="!agreement"
        dense
        only-clients
      />
      <v-text-field
        v-model="params.num"
        outlined
        dense
        label="Номер заказа клиента"
        :errorMessages="numErrorMessages"
      />
      <v-text-field
        v-model="params.auctionNum"
        outlined
        dense
        label="Номер аукциона"
        :errorMessages="auctionNumErrorMessages"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import { AgreementService } from '@/shared/services'

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
    isValidNum: {
      type: Boolean,
      default: true,
    },
    isValidAuctionNum: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      agreement: null,
      errorMessage: null,
      loading: false,
      params: {
        client: null,
        num: null,
        auctionNum: null,
        agreement: null,
      },
    }
  },
  computed: {
    numErrorMessages() {
      return this.isValidNum
        ? []
        : ['Номер заказа клиента не может быть пустым']
    },
    auctionNumErrorMessages() {
      return this.isValidAuctionNum
        ? []
        : ['Номер аукциона не может быть пустым']
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          this.params.client = val.client
          this.params.num = val.num
          this.params.auctionNum = val.auctionNum
          this.params.agreement = val.agreement
        }
        if (val?.agreement) {
          this.agreement = await AgreementService.getById(val.agreement)
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
      if (!this.routeDate || !this.params.client) return null
      try {
        this.loading = true
        if (this.params.agreement) {
          this.agreement = await AgreementService.getById(this.params.agreement)
        } else {
          this.agreement = await AgreementService.getForOrder({
            company: this.$store.getters.directoriesProfile,
            date: this.routeDate,
            client: this.params.client,
          })
          this.params.agreement = this.agreement._id
        }

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
  grid-template-columns: 280px 230px 230px;
  margin: 10px;
  gap: 10px;
}
</style>
