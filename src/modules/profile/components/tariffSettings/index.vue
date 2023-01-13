<template>
  <div id="settings-wrapper">
    <v-text-field
      v-model="tmpSettings.date"
      label="Дата"
      outlined
      :disabled="disabled"
      type="date"
      hide-details
      dense
      :style="{ 'max-width': '200px' }"
    />
    <v-autocomplete
      v-model="tmpSettings.agreement"
      label="Соглашение"
      dense
      :disabled="disabled"
      :items="agreements"
      auto-select-first
      outlined
      hide-details
      item-value="_id"
      item-text="name"
      :style="{ 'max-width': '400px' }"
    />
    <v-autocomplete
      v-model="tmpSettings.document"
      :disabled="!tmpSettings.agreement"
      label="Документ"
      :items="documents"
      item-value="_id"
      item-text="name"
      outlined
      dense
      hide-details
      auto-select-first
    />
    <v-select
      v-model="tmpSettings.type"
      label="Тип тарифа"
      :items="$store.getters.tariffTypes"
      dense
      outlined
      hide-details
      :style="{ 'max-width': '220px' }"
    />
    <v-select
      v-model="tmpSettings.truckKind"
      :items="$store.getters.truckKinds"
      label="Вид транспорта"
      :style="{ 'max-width': '200px' }"
      outlined
      clearable
      dense
      hide-details
    />
    <v-select
      v-model="tmpSettings.liftCapacity"
      :items="$store.getters.liftCapacityTypes"
      label="Грузоподъемность"
      :style="{ 'max-width': '200px' }"
      outlined
      clearable
      dense
      hide-details
    />
    <v-checkbox
      v-model="tmpSettings.groupVat"
      label="Тариф c НДС"
      :disabled="disabled"
      dense
      hide-details
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import uuid from 'uuid'
import { AgreementService } from '@/shared/services'

export default {
  name: 'TariffCommonSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      agreements: [],
      tmpSettings: {
        group: uuid.v4(),
        groupVat: false,
        document: null,
        agreement: null,
        agreementVatRate: null,
        date: null,
        truckKind: null,
        liftCapacity: null,
      },
    }
  },
  computed: {
    documents() {
      if (this.tmpSettings.agreement && this.agreements.length) {
        const { clients, outsourceCarriers } = this.agreements.find(
          (i) => i._id === this.tmpSettings.agreement
        )
        const partners = [...(clients || []), ...(outsourceCarriers || [])]
        return this.$store.getters.documents.filter((i) =>
          partners.includes(i.partner)
        )
      } else return []
    },
  },
  watch: {
    ['tmpSettings.agreement']: function (val) {
      if (val)
        this.tmpSettings.groupVat =
          !!this.agreements.find((i) => i._id === val)?.vatRate || false
      this.tmpSettings.agreementVatRate = this.agreements.find(
        (i) => i._id === val
      )?.vatRate
    },

    ['tmpSettings.document']: function (val) {
      if (!val || !this.$store.getters.documentsMap.has(val)) return null
      const dateValue = this.$store.getters.documentsMap.get(val)?.date
      if (!dateValue) return null

      this.tmpSettings.date = dayjs(dateValue).format('YYYY-MM-DD')
    },

    tmpSettings: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.$emit('change', {
          ...val,
          date: val.date ? new Date(val.date).toISOString() : null,
        })
      },
    },
  },
  created() {
    if (this.settings?.group) this.tmpSettings = { ...this.settings }
    else {
      // default values
      this.tmpSettings.truckKind =
        this.$store.getters.companySettings?.defaultTruckKind || null
      this.tmpSettings.liftCapacity =
        this.$store.getters.companySettings?.defaultLiftCapacity || null
      this.tmpSettings.date = dayjs().format('YYYY-MM-DD')
    }
    this.getAgreements()
  },
  methods: {
    async getAgreements() {
      try {
        this.agreementLoading = true
        this.agreements = await AgreementService.getActiveAgreements()
        this.agreementLoading = false
      } catch (e) {
        this.agreementLoading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style scoped>
#settings-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin: 10px;
}
</style>
