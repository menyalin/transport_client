<template>
  <v-container>
    <v-row>
      <v-col>
        <div id="report-settings">
          Настойки отчета (пока зашиты 30 дней)
        </div>
        <v-data-table
          :headers="headers"
          :items="rows"
          :loading="loading"
          fixed-header
          height="76vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import ReportService from '../../services/index.js'

export default {
  name: 'DaysControl',
  data() {
    return {
      loading: false,
      rows: [],
      headers: [
        { value: 'name', text: 'Имя' },
        { value: 'controlDates.title', text: 'Объект' },
        { value: 'controlDates.validDays', text: 'Кол-во дней' },
      ],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    dblClickRow(_, { item }) {
      this.$router.push(`/profile/${item.collection}/${item._id}`)
    },
    async getData() {
      this.loading = true
      this.rows = await ReportService.daysControl({
        profile: this.directoriesProfile,
      })
      this.loading = false
    },
  },
}
</script>
<style></style>
