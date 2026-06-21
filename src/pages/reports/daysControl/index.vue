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
            :items="carrierStore.carriers"
            hideDetails
            item-title="name"
            item-value="_id"
            multiple
            :style="{ 'max-width': '300px' }"
          />
          <v-text-field
            v-model.number="settings.dayCount"
            label="Кол-во дней"
            hideDetails
            :style="{ 'max-width': '150px' }"
          />
          <v-text-field
            v-model.trim="searchString"
            label="Поиск"
            hideDetails
            :style="{ 'max-width': '500px' }"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="rows"
          :item-value="(item) => item._id + '-' + (item.controlDates?.dbField || 'main')"
          :loading="loading"
          item-value="_id"
          :search="searchString"
          fixed-header
          height="76vh"
          :footer-props="{
            'items-per-page-options': [100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.tkName`]="{ item }">
            {{ carrierStore.carriersMap.get(item.tkName)?.name }}
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
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ReportService } from '@/shared/services'
import { ReportTitle } from '@/shared/ui'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'DaysControl' })

const carrierStore = useCarrierStore()
const store = useStore()
const router = useRouter()

const searchString = usePersistedRef(null, 'DaysControlReport:search')

const settings = usePersistedRef(
  {
    carriers: [],
    dayCount: 30,
    search: null,
  },
  'DaysControlReport:settings'
)

const loading = ref(false)
const rows = ref([])

const headers = [
  { value: 'tkName', title: 'ТК' },
  { value: 'name', title: 'Имя' },
  { value: 'controlDates.title', title: 'Объект' },
  { value: 'controlDates.validDays', title: 'Кол-во дней', align: 'center' },
  { value: 'controlDates.endDate', title: 'Дата завершения', align: 'center' },
  { value: 'note', title: 'Комментарий' },
]

const directoriesProfile = computed(() => store.getters.directoriesProfile)

watch(settings, getData, { immediate: true, deep: true })

function dblClickRow(_, { item }) {
  router.push(`/profile/${item.collection}/${item._id}`)
}

async function getData() {
  try {
    loading.value = true
    rows.value = await ReportService.daysControl({
      carriers: settings.value.carriers,
      profile: directoriesProfile.value,
      days: settings.value.dayCount,
    })
  } catch (e) {
    console.error(e)
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
#report-settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
  margin-top: 15px;
}
</style>
