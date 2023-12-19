<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="client-block">
      <app-partner-autocomplete
        v-model="params.client"
        label="Заказчик"
        outlined
        :loading="loading"
        :messages="agreementNameSring"
        :error="!agreement"
        dense
        only-clients
      />

      <v-text-field
        v-model.trim="params.num"
        outlined
        dense
        label="Номер заказа клиента"
        :errorMessages="numErrorMessages"
        :style="{ maxWidth: '300px' }"
      />
      <v-text-field
        v-model.trim="params.auctionNum"
        outlined
        dense
        label="Номер аукциона"
        :errorMessages="auctionNumErrorMessages"
        :style="{ maxWidth: '300px' }"
      />
    </div>
    <v-btn
      v-if="showChangeAgreementBtn"
      color="primary"
      outlined
      text
      small
      class="mb-3 ml-5"
      @click="changeAgreementHandler"
    >
      Изменить соглашение
    </v-btn>
  </div>
</template>
<script>
import { AgreementService } from '@/shared/services'
import { BlockTitle } from '@/entities/order'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'

export default {
  name: 'ClientBlock',
  components: {
    BlockTitle,
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
    carrier: String,
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
      tmpCarrier: null,
      agreements: [],
      agreement: null,
      errorMessage: null,
      loading: false,
      params: {
        client: null,
        num: null,
        auctionNum: null,
        agreement: null,
        directiveAgreement: false,
      },
    }
  },
  computed: {
    agreementNameSring() {
      const suffix = this.params.directiveAgreement
        ? ' (Установлено вручную)'
        : ''
      return this.agreement
        ? [this.agreement.name + suffix]
        : ['Соглашение отсутствует']
    },
    showChangeAgreementBtn() {
      return this.agreements.length > 1
    },
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
    carrier(val) {
      if (val && val !== this.tmpCarrier) {
        this.clearAgreement()
        this.setAgreement()
      }
    },
    item: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.params = { ...val }
        this.getAgreements()
      },
    },

    params: {
      deep: true,
      handler: function (val) {
        const keys = Object.keys(this.params)
        if (keys.some((key) => val[key] !== this.item[key])) {
          this.$emit('change', this.params)
        }
      },
    },
    ['params.client']: {
      handler: async function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.clearAgreement(true)
          await this.getAgreements()
        }
      },
    },
    routeDate: async function () {
      this.$emit('change', {
        ...this.params,
        agreement: this.params.directiveAgreement
          ? this.params.agreement
          : null,
      })
    },
  },
  methods: {
    changeAgreementHandler() {
      if (!Array.isArray(this.agreements) || this.agreements.length < 2) return
      const currentIdx = this.agreements.findIndex(
        (i) => i._id === this.agreement._id
      )
      let nextIdx = 0
      if (currentIdx !== -1 && currentIdx + 1 !== this.agreements.length)
        nextIdx = currentIdx + 1
      this.agreement = this.agreements[nextIdx]
      this.params.agreement = this.agreement._id
      this.params.directiveAgreement = true
    },

    findAgreement(agreements, carrier) {
      if (agreements.length === 0) return null
      if (!carrier) return agreements[0]
      return (
        agreements.find((i) => i.allowedCarriers.includes(carrier)) ||
        agreements[0]
      )
    },

    setAgreement() {
      if (this.params.agreement)
        this.agreement = this.agreements.find(
          (i) => i._id === this.params.agreement
        )
      else {
        this.agreement = this.findAgreement(this.agreements, this.carrier)
        this.params.agreement = this.agreement?._id || null
      }
      this.$emit('updateAgreement', this.agreement)
    },

    async getAgreements() {
      if (!this.routeDate || !this.params.client) return null
      try {
        this.loading = true
        this.agreements = await AgreementService.getForClient({
          client: this.params.client,
          date: new Date(this.routeDate).toISOString(),
        })
        this.setAgreement()
        this.tmpCarrier = this.carrier
        this.loading = false
      } catch (e) {
        this.loading = false
        this.errorMessage = e.message
      }
    },

    clearAgreement(forceUpdate = false) {
      if (forceUpdate || !this.params.directiveAgreement) {
        this.params.agreement = null
        this.agreement = null
        this.directiveAgreement = false
        this.$emit('updateAgreement', null)
      }
    },
  },
}
</script>
<style scoped>
.client-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  margin: 10px;
  gap: 10px;
}
</style>
