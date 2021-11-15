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
        :items="trucks"
        outlined
        @change="change($event, 'truck')"
      />
      <v-btn
        :disabled="!date || !params.truck"
        icon
        @click="getCrew"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
      <v-autocomplete
        label="Водитель"
        :value="params.driver"
        :items="drivers"
        readonly
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
        outlined
        @change="change($event, 'trailer')"
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
  methods: {
    async change(val, field) {
      this.params[field] = val
      if (field === 'truck') {
        await this.getCrew()
      } else {
        this.$emit('change', this.params)
      }
    },
    async getCrew() {
      if (!this.date || !this.params.truck) return null
      this.loading = true
      this.params.driver = null
      this.params.trailer = null
      const crew = await CrewService.getCrewByTruckAndDate({
        truck: this.params.truck,
        date: this.date,
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
  grid-template-columns: 300px 30px 300px 300px;
  margin: 10px;
  gap: 15px;
}
</style>
