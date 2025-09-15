<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('region:write')"
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
          :items="regions"
          :loading="loading"
          fixed-header
          :search="settings.search"
          height="73vh"
          density="compact"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { mapGetters } from 'vuex'
export default {
  name: 'RegionList',
  components: {
    ButtonsPanel,
  },
  data: () => ({
    formName: 'RegionList',
    settings: {
      search: null,
      listOptions: {},
    },
    headers: [{ value: 'name', text: 'Наименование' }],
  }),
  computed: {
    ...mapGetters(['regions', 'loading', 'directoriesProfile']),
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getRegions')
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
    create() {
      this.$router.push({ name: 'RegionCreate' })
    },
    refresh() {
      this.$store.dispatch('getRegions', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`regions/${item._id}`)
    },
  },
}
</script>
<style scoped>
#settings-wrapper {
  display: grid;
  grid-template-columns: 400px;
  gap: 10px;
}
</style>
