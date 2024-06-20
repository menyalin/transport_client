<template>
  <v-container>
    <v-row>
      <v-col>
        <ReportTitle title="Контроль сроков" />
        <div id="report-settings">
          <v-btn icon @click.stop="getData">
            <v-icon> mdi-cached </v-icon>
          </v-btn>
          <v-text-field
            v-model.number="settings.dayCount"
            label="Кол-во дней"
            hideDetails
            outlined
            dense
          />
          <v-text-field
            v-model.trim="settings.search"
            label="Поиск"
            hideDetails
            outlined
            dense
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="rows"
          :loading="loading"
          :search="settings.search"
          fixed-header
          height="76vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.tkName`]="{ item }">
            {{ $store.getters.tkNamesMap.get(item.tkName).name }}
          </template>
          <template #[`item.note`]="{ item }">
            {{ item.controlDates.note || item.note }}
          </template>
          <template #[`item.controlDates.endDate`]="{ item }">
            {{ new Date(item.controlDates.endDate).toLocaleDateString() }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ReportService } from '@/shared/services'
import { ReportTitle } from '@/shared/ui'

export default {
  name: 'DaysControl',
  components: {
    ReportTitle,
  },
  data() {
    return {
      formName: 'DaysControlReport',
      loading: false,
      settings: {
        dayCount: 30,
        search: null,
      },
      rows: [],
      headers: [
        { value: 'tkName', text: 'ТК' },
        { value: 'name', text: 'Имя' },
        { value: 'controlDates.title', text: 'Объект' },
        {
          value: 'controlDates.validDays',
          text: 'Кол-во дней',
          align: 'center',
        },
        {
          value: 'controlDates.endDate',
          text: 'Дата завершения',
          align: 'center',
        },
        { value: 'note', text: 'Комментарий' },
      ],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
  },
  watch: {
    ['settings.dayCount']: {
      deep: true,
      handler: function () {
        this.getData()
      },
    },
  },
  async mounted() {
    await this.getData()
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: this.settings,
    })
    next()
  },
  methods: {
    dblClickRow(_, { item }) {
      this.$router.push(`/profile/${item.collection}/${item._id}`)
    },
    async getData() {
      this.loading = true
      this.rows = await ReportService.daysControl({
        profile: this.directoriesProfile,
        days: this.settings.dayCount,
      })
      this.loading = false
    },
  },
}
</script>
<style scoped>
#report-settings {
  display: grid;
  grid-template-columns: 50px 150px 300px;
  gap: 10px;
  margin-top: 15px;
}
</style>
