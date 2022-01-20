<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="confirmed-crew-block">
      <v-autocomplete
        label="Грузовик"
        :loading="loading"
        :value="params.truck"
        dense
        :clearable="!confirmed"
        :readonly="confirmed"
        :items="trucks"
        outlined
        hide-details
        @change="change($event, 'truck')"
      />

      <v-autocomplete
        label="Водитель"
        :value="params.driver"
        :items="drivers"
        readonly
        hide-details
        dense
        outlined
        @change="change($event, 'driver')"
      />
      <v-autocomplete
        label="Прицеп"
        :value="params.trailer"
        :items="trailers"
        readonly
        dense
        hide-details
        outlined
        @change="change($event, 'trailer')"
      />
      <v-btn
        text
        small
        color="primary"
        @click="copyHandler"
      >
        Скопировать данные
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from './blockTitle.vue'
import CrewService from '@/modules/profile/services/crew.service'

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

      params: {
        truck: null,
        trailer: null,
        driver: null,
      },
    }
  },
  computed: {
    ...mapGetters([]),
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
  },
  async created() {
    await this.getCrew()
  },
  /**

  Рено   Х681ВТ799   ЕМ558577
  Стародубцев Виталий Юрьевич
  Паспорт 68 02 571679 Выдан Мичуринским ГУВД Тамбовской обл. 18.06.2002
  тел +7 (920) 470-01-51

   **/

  methods: {
    copyHandler() {
      if (!this.params.truck || !this.params.driver) return null
      const d = {
        truckMark: this.$store.getters.trucksMap.get(this.params.truck)?.brand,
        truckRegNum: this.$store.getters.trucksMap.get(this.params.truck)
          ?.regNum,
        trailerRegNum: this.$store.getters.trucksMap.get(this.params.trailer)
          ?.regNum,
        driver: this.$store.getters.driversMap.get(this.params.driver)
          ?.fullName,
        passportId: this.$store.getters.driversMap.get(this.params.driver)
          ?.passportId,
        passportIssued: this.$store.getters.driversMap.get(this.params.driver)
          ?.passportIssued,
        passportDate: this.$store.getters.driversMap.get(this.params.driver)
          ?.passportDate,
        licenseId: this.$store.getters.driversMap.get(this.params.driver)
          ?.licenseId,
        licenseDate: this.$store.getters.driversMap.get(this.params.driver)
          ?.licenseDate,
        phone: this.$store.getters.driversMap.get(this.params.driver)?.phone,
        phone2: this.$store.getters.driversMap.get(this.params.driver)?.phone2,
      }
      let resStr = `${!!d.truckMark ? d.truckMark + '\t' : ''}${
        d.truckRegNum
      }  ${d.trailerRegNum || ''}\n`
      resStr += `${d.driver}\n`
      resStr += `Паспорт ${d.passportId || '-'}, Выдан ${
        d.passportIssued || '-'
      }, от ${
        d.passportDate ? new Date(d.passportDate).toLocaleDateString() : '-'
      }\n`
      resStr += `ВУ ${d.licenseId || '-'}, от ${
        d.licenseDate ? new Date(d.licenseDate).toLocaleDateString() : '-'
      }\n`
      resStr += `тел: ${d.phone || ''}  ${d.phone2 || ''}`
      navigator.clipboard.writeText(resStr).then()
    },
    async change(val, field) {
      this.params[field] = val
      if (!val) {
        this.params.driver = null
        this.params.trailer = null
      }
      if (field === 'truck') {
        await this.getCrew()
      } else {
        this.$emit('change', this.params)
      }
    },
    async getCrew() {
      if (!this.date || !this.params.truck || this.confirmed) return null
      this.loading = true
      this.params.driver = null
      this.params.trailer = null
      const crew = await CrewService.getCrewByTruckAndDate({
        truck: this.params.truck,
        date: new Date(this.date),
      })
      this.params.driver = crew?.driver
      this.params.trailer = crew?.transport?.trailer
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
</style>
