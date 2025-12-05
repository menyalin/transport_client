<template>
  <v-menu offsetY :closeOnContentClick="false">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" icon>
        <v-icon size="small">mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-list class="px-3">
      <v-switch
        v-model="onlyTrucksWithRoutes"
        label="Только грузовики с рейсами"
       
        hideDetails
        @update:model-value="changeOnlyTrucksWithRoutes"
      />
      <v-switch
        v-model="onlyPlannedDates"
        label="Планируемые даты"
       
        hideDetails
        @update:model-value="changeOnlyPlannedDates"
      />
      <v-switch
        v-model="tmpSettings.showBufferZone"
        label="Показать буферную зону"
       
        hideDetails
        :modelValue="currentSettings.showBufferZone"
      />
      <v-switch
        v-model="tmpSettings.controlOnly"
        label="Показывать 'на контроле'"
       
        hideDetails
        :modelValue="currentSettings.controlOnly"
      />
      <v-switch
        v-model="tmpSettings.showDowntimes"
        label="Показывать сервисы/выходные"
       
        hideDetails
        :modelValue="currentSettings.showDowntimes"
      />
      <v-switch
        v-model="tmpSettings.showNotes"
        label="Показать заметки"
       
        hideDetails
        :modelValue="currentSettings.showNotes"
      />
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
      default: () => ({}),
    },
    settings: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'change'],
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
  computed: {
    currentSettings() {
      // Используем modelValue если доступно, иначе settings
      return this.modelValue || this.settings
    },
  },
  watch: {
    tmpSettings: {
      deep: true,
      handler: function (val) {
        localStorage.setItem(this.settingsName, JSON.stringify(val))
        this.$emit('change', val)
        this.$emit('update:modelValue', val)
      },
    },
  },
  created() {
    const settings = JSON.parse(localStorage.getItem(this.settingsName))
    if (settings) {
      this.tmpSettings = settings
    } else {
      this.tmpSettings = {
        controlOnly: false,
        showNotes: true,
        showBufferZone: false,
        showDowntimes: true,
      }
    }
    // Синхронизируем с текущими настройками
    if (this.currentSettings && Object.keys(this.currentSettings).length > 0) {
      this.tmpSettings = { ...this.tmpSettings, ...this.currentSettings }
    }
  },
}
</script>
<style scoped></style>
