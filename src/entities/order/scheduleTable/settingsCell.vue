<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" icon>
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
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
export default {
  name: 'SettingsCell',
  props: {
    modelValue: {
      type: Object,
    },
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const onlyTrucksWithRoutes = ref(true)
    const onlyPlannedDates = ref(false)
    const menuOpen = ref(false)

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
      menuOpen,
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
        this.$emit('update:modelValue', val)
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
