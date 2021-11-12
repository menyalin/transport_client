<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="confirmed-crew-block">
      <v-autocomplete
        label="Грузовик"
        :value="params.truck"
        dense
        :items="trucks"
        outlined
        @change="change($event, 'truck')"
      />
      <v-btn
        :disabled="!date || !params.truck"
        @click="getCrew"
      >
        get crew
      </v-btn>
      <v-autocomplete
        label="Водитель"
        :value="params.driver"
        :items="drivers"
        readonly
        dense
        outlined
      />
      <v-autocomplete
        label="Прицеп"
        :value="params.trailer"
        :items="trailers"
        readonly
        dense
        outlined
      />
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
  },
  data() {
    return {
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
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
    async getCrew() {
      if (!this.date) return null
      const crew = await CrewService.getCrewByTruckAndDate({
        truck: this.params.truck,
        date: this.date,
      })
      console.log(crew)
      this.params.driver = crew.driver
      this.params.trailer = crew.transport.trailer
    },
  },
}
</script>
<style scoped>
.confirmed-crew-block {
  display: grid;
  grid-template-columns: 300px 150px 300px 300px;
  margin: 10px;
  gap: 15px;
}
</style>
