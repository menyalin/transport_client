<template>
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" icon v-on="on">
        <v-icon small> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-3">
      <v-switch
        v-model="onlyTrucksWithRoutes"
        label="Только грузовики с рейсами"
        dense
        hide-details
        @change="changeOnlyTrucksWithRoutes"
      />
      <v-switch
        v-model="onlyPlannedDates"
        label="Планируемые даты"
        dense
        hide-details
        @change="changeOnlyPlannedDates"
      />
      <v-switch
        v-model="tmpSettings.showBufferZone"
        label="Показать буферную зону"
        dense
        hide-details
      />
      <v-switch
        v-model="tmpSettings.controlOnly"
        label="Показывать 'на контроле'"
        dense
        hide-details
      />
      <v-switch
        v-model="tmpSettings.showDowntimes"
        label="Показывать сервисы/выходные"
        dense
        hide-details
      />
      <v-switch
        v-model="tmpSettings.showNotes"
        label="Показать заметки"
        dense
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
