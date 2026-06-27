<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="text">
        <v-icon size="small"> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-3">
      <v-switch
        v-model="onlyTrucksWithRoutes"
        label="Только грузовики с рейсами"
        hide-details
        @update:model-value="changeOnlyTrucksWithRoutes"
      />
      <v-switch
        v-model="onlyPlannedDates"
        label="Планируемые даты"
        hide-details
        @update:model-value="changeOnlyPlannedDates"
      />
      <v-switch v-model="tmpSettings.showBufferZone" label="Показать буферную зону" hide-details />
      <v-switch v-model="tmpSettings.controlOnly" label="Показывать 'на контроле'" hide-details />
      <v-switch
        v-model="tmpSettings.showDowntimes"
        label="Показывать сервисы/выходные"
        hide-details
      />
      <v-switch v-model="tmpSettings.showNotes" label="Показать заметки" hide-details />
    </v-list>
  </v-menu>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'SettingsCell' })

const settingsModel = defineModel({ type: Object })

const settingsName = 'ScheduleSettingsCell'
const store = useStore()

const onlyTrucksWithRoutes = ref(true)
const onlyPlannedDates = ref(false)
const menuOpen = ref(false)

const defaultSettings = {
  controlOnly: false,
  showNotes: true,
  showBufferZone: false,
  showDowntimes: true,
}

const saved = JSON.parse(localStorage.getItem(settingsName))
const tmpSettings = reactive(saved || { ...defaultSettings })

if (settingsModel.value) {
  Object.assign(settingsModel.value, tmpSettings)
} else {
  settingsModel.value = { ...tmpSettings }
}

watch(
  tmpSettings,
  (val) => {
    localStorage.setItem(settingsName, JSON.stringify(val))
    settingsModel.value = val
  },
  { deep: true }
)

function changeOnlyTrucksWithRoutes() {
  store.commit('changeOnlyTrucksWithRoutes')
}

function changeOnlyPlannedDates() {
  store.commit('changeOnlyPlannedDates')
}

onMounted(() => {
  onlyTrucksWithRoutes.value = store.getters.onlyTrucksWithRoutes
  onlyPlannedDates.value = store.getters.onlyPlannedDates
})
</script>
<style scoped></style>
