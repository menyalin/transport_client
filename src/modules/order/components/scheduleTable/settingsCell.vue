<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn color="primary" icon v-bind="props">
        <v-icon size="small"> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-3">
      <v-switch
        label="Планируемые даты"
        density="compact"
        hide-details
        :value="$store.getters.onlyPlannedDates"
        @update:model-value="$store.commit('changeOnlyPlannedDates')"
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
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
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
})
</script>
<style scoped></style>
