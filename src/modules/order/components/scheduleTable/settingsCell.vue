<template>
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" icon v-on="on">
        <v-icon small> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-3">
      <v-switch
        label="Планируемые даты"
        dense
        hide-details
        :value="$store.getters.onlyPlannedDates"
        @change="$store.commit('changeOnlyPlannedDates')"
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
