<template>
  <v-menu>
    <template #activator="{ props }">
      <v-icon v-bind="props" size="small"> mdi-cog </v-icon>
    </template>
    <v-list class="px-3">
      <v-switch
        v-model="onlyTrucksWithRoutes"
        label="Только грузовики с рейсами"
        density="compact"
        hide-details
        @update:model-value="changeOnlyTrucksWithRoutes"
      />
      <v-switch
        v-model="onlyPlannedDates"
        label="Планируемые даты"
        density="compact"
        hide-details
        @update:model-value="changeOnlyPlannedDates"
      />
      <v-switch
        v-model="tmpSettings.showBufferZone"
        label="Показать буферную зону"
        density="compact"
        hide-details
      />
      <v-switch
        v-model="tmpSettings.controlOnly"
        label="Показывать 'на контроле'"
        density="compact"
        hide-details
      />
      <v-switch
        v-model="tmpSettings.showDowntimes"
        label="Показывать сервисы/выходные"
        density="compact"
        hide-details
      />
      <v-switch
        v-model="tmpSettings.showNotes"
        label="Показать заметки"
        density="compact"
        hide-details
      />
    </v-list>
  </v-menu>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
export default {
  name: 'SettingsCell',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: {
      type: Object,
    },
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const onlyTrucksWithRoutes = ref(false)
    const onlyPlannedDates = ref(false)

    const changeOnlyTrucksWithRoutes = () => {
      proxy.$store.commit('changeOnlyTrucksWithRoutes')
    }
    const changeOnlyPlannedDates = () => {
      proxy.$store.commit('changeOnlyPlannedDates')
    }

    onMounted(() => {
      onlyTrucksWithRoutes.value = proxy.$store.getters.onlyTrucksWithRoutes
      onlyPlannedDates.value = proxy.$store.getters.onlyPlannedDates
    })

    return {
      onlyTrucksWithRoutes,
      onlyPlannedDates,
      changeOnlyTrucksWithRoutes,
      changeOnlyPlannedDates,
    }
  },
  data() {
    return {
      settingsName: 'ScheduleSettingsCell',
      tmpSettings: {
        controlOnly: false,
        showNotes: true,
        showBufferZone: false,
        showDowntimes: true,
      },
    }
  },
  watch: {
    tmpSettings: {
      deep: true,
      handler: function (val) {
        localStorage.setItem(this.settingsName, JSON.stringify(val))
        this.$emit('change', val)
      },
    },
  },
  created() {
    const settings = JSON.parse(localStorage.getItem(this.settingsName))
    if (settings) {
      this.tmpSettings = settings
    } else
      this.tmpSettings = {
        controlOnly: false,
        showNotes: true,
        showBufferZone: false,
        showDowntimes: true,
      }
  },
}
</script>
<style scoped></style>
