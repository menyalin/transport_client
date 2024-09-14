<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('zone:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div id="settings-wrapper">
          <v-text-field
            v-model="settings.search"
            label="Поиск"
            variant="outlined"
            hide-details
            density="compact"
            clearable
          />
        </div>
        <v-data-table
          v-model:options="settings.listOptions"
          :headers="headers"
          :items="zones"
          :loading="loading"
          fixed-header
          :search="settings.search"
          height="73vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import { ButtonsPanel } from '@/shared/ui'
export default defineComponent({
  name: 'ZoneList',
  components: {
    ButtonsPanel,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  data: () => ({
    formName: 'ZoneList',
    settings: {
      search: null,
      listOptions: {},
    },
    headers: [{ value: 'name', text: 'Наименование' }],
  }),
  computed: {
    ...mapGetters(['zones', 'loading', 'directoriesProfile']),
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getZones')
  },
  methods: {
    create() {
      this.$router.push({ name: 'ZoneCreate' })
    },
    refresh() {
      this.$store.dispatch('getZones', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`zones/${item._id}`)
    },
  },
})
</script>
<style scoped>
#settings-wrapper {
  display: grid;
  grid-template-columns: 400px;
  gap: 10px;
}
</style>
