<template>
  <v-container>
    <v-row>
      <v-col>
        <ReportTitle title="Контроль сроков" />
        <div id="report-settings">
          <v-btn icon @click.stop="getData">
            <v-icon> mdi-cached </v-icon>
          </v-btn>
          <v-autocomplete
            v-model="settings.carriers"
            label="Перевозчик"
            :items="carrierItems"
            hideDetails
            outlined
            item-text="name"
            item-value="_id"
            dense
            multiple
            clearable
            :style="{ 'max-width': '300px' }"
          />
          <v-text-field
            v-model.number="settings.dayCount"
            label="Кол-во дней"
            hideDetails
            outlined
            dense
          />
          <v-text-field
            v-model.trim="searchString"
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
          :search="searchString"
          fixed-header
          height="76vh"
          dense
          :footer-props="{
            'items-per-page-options': [100, 200],
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
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { useCarriers } from '@/entities/carrier/useCarriers'

export default {
  name: 'DaysControl',
  components: {
    ReportTitle,
  },
  setup() {
    const { allCarriers: carrierItems } = useCarriers()
    const searchString = usePersistedRef(null, 'DaysControlReport:search')
    const settings = usePersistedRef(
      {
        carriers: [],
        dayCount: 30,
        search: null,
      },
      'DaysControlReport:settings'
    )

    return {
      searchString,
      settings,
      carrierItems,
    }
  },
  data() {
    return {
      loading: false,
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
    settings: {
      immediate: true,
      deep: true,
      handler: async function () {
        await this.getData()
      },
    },
  },

  methods: {
    dblClickRow(_, { item }) {
      this.$router.push(`/profile/${item.collection}/${item._id}`)
    },
    async getData() {
      try {
        this.loading = true
        this.rows = await ReportService.daysControl({
          carriers: this.settings.carriers,
          profile: this.directoriesProfile,
          days: this.settings.dayCount,
        })
      } catch (e) {
        console.error(e)
        this.$store.commit('setError', e.message)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style scoped>
#report-settings {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 15px;
}
</style>
