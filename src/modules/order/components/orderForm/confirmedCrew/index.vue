<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="confirmed-crew-block">
      <v-autocomplete
        v-model="params.truck"
        label="Грузовик"
        :loading="loading"
        dense
        :clearable="!confirmed"
        :readonly="
          confirmed &&
          !$store.getters.hasPermission('fake permission. only for admin!')
        "
        :items="trucks"
        outlined
        hide-details
      />
      <v-autocomplete
        label="Водитель"
        :value="params.driver"
        :items="drivers"
        :readonly="
          !$store.getters.hasPermission('fake permission. only for admin!')
        "
        hide-details
        dense
        outlined
      />
      <v-autocomplete
        label="Прицеп"
        :value="params.trailer"
        :items="trailers"
        :readonly="
          !$store.getters.hasPermission('fake permission. only for admin!')
        "
        dense
        hide-details
        outlined
      />
      <v-btn text small color="primary" @click="copyHandler">
        Скопировать данные
      </v-btn>
    </div>
    <div v-if="showOutsourceAgreementRow" class="outsource-agreement-row ml-4">
      <small>Перевозчик: {{ tkName }}</small>
      <small>Соглашение: {{ outsourceAgreementName }}</small>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from '../blockTitle.vue'
import CrewService from '@/modules/profile/services/crew.service'
import putCrewDataToClipboard from './putCrewDataToClipboard'
import agreementService from '@/modules/profile/services/agreement.service'

export default {
  name: 'ConfirmedCrew',
  components: {
    AppBlockTitle,
  },
  model: {
    prop: 'crew',
    event: 'change',
  },
  props: {
    crew: Object,
    title: String,
    date: String,
    confirmed: Boolean,
  },
  data() {
    return {
      loading: false,
      outsourceAgreement: {},
      params: {
        truck: null,
        trailer: null,
        driver: null,
        outsourceAgreement: null,
        tkName: null,
      },
    }
  },
  computed: {
    ...mapGetters([]),
    showOutsourceAgreementRow() {
      return (
        this.params.truck &&
        this.$store.getters.outsourceTruckIds.includes(this.params.truck)
      )
    },
    tkName() {
      return (
        this.$store.getters.trucksMap.get(this.params.truck)?.tkName?.name ||
        '-'
      )
    },
    outsourceAgreementName() {
      return this.outsourceAgreement.name
    },
    trucks() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .map((item) => ({ value: item._id, text: item.regNum }))
    },
    drivers() {
      return this.$store.getters.drivers.map((item) => ({
        value: item._id,
        text: item.fullName,
      }))
    },
    trailers() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'trailer')
        .map((item) => ({ value: item._id, text: item.regNum }))
    },
  },
  watch: {
    crew: {
      immediate: true,
      handler: function (val) {
        if (val) {
          const keys = Object.keys(this.params)
          keys.forEach((key) => {
            this.params[key] = val[key]
          })
        }
      },
    },
    date: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          await this.getCrew()
        }
      },
    },
    ['params.truck']: {
      handler: async function (val) {
        if (!val) {
          this.params.driver = null
          this.params.trailer = null
          this.params.outsourceAgreement = null
          this.params.tkName = null
        }
        await this.getCrew()

        if (this.$store.getters.outsourceTruckIds.includes(val))
          await this.getAgreement()
        else this.params.outsourceAgreement = null

        this.$emit('change', this.params)
      },
    },
  },
  async created() {
    await this.getCrew()
    if (this.params.outsourceAgreement)
      this.outsourceAgreement = await agreementService.getById(
        this.params.outsourceAgreement
      )
  },

  methods: {
    copyHandler() {
      if (!this.params.truck || !this.params.driver) return null
      const truck = this.$store.getters.trucksMap.get(this.params.truck)
      const driver = this.$store.getters.driversMap.get(this.params.driver)
      const trailer = this.$store.getters.trucksMap.get(this.params.trailer)
      putCrewDataToClipboard({ truck, driver, trailer })
    },
    async getAgreement() {
      const truck = this.$store.getters.trucksMap.get(this.params.truck)
      this.outsourceAgreement = await agreementService.getForOrder({
        company: this.$store.getters.directoriesProfile,
        date: this.date,
        tkNameId: truck?.tkName?._id || truck.tkName,
      })
      this.params.outsourceAgreement = this.outsourceAgreement._id
    },
    async getCrew() {
      if (!this.date || !this.params.truck || this.confirmed) return null
      this.loading = true
      this.params.driver = null
      this.params.trailer = null
      this.params.tkName = null
      const crew = await CrewService.getCrewByTruckAndDate({
        truck: this.params.truck,
        date: new Date(this.date),
      })
      this.params.driver = crew?.driver
      this.params.trailer = crew?.transport?.trailer
      this.params.tkName = this.$store.getters.trucksMap.get(
        this.params.truck
      )?.tkName?._id
      this.loading = false
      this.$emit('change', this.params)
    },
  },
}
</script>
<style scoped>
.confirmed-crew-block {
  display: grid;
  grid-template-columns: 300px 300px 300px 250px;
  margin: 10px;
  gap: 15px;
  align-items: center;
}
.outsource-agreement-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
</style>
