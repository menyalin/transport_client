<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('document:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div id="settings-wrapper">
          <app-partner-autocomplete
            v-model="settings.partner"
            label="Партнер"
            hideAppendIcon
            dense
            outlined
            hide-details
            :style="{ width: '300px' }"
          />
          <v-text-field
            v-model="settings.search"
            label="Поиск"
            outlined
            hide-details
            dense
            clearable
            :style="{ 'max-width': '400px' }"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="prepareDocuments"
          :loading="loading"
          fixed-header
          :search="settings.search"
          height="73vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.useInTariff`]="{ item }">
            <div>{{ item.useInTariff ? 'Да' : 'Нет' }}</div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'

import { mapGetters } from 'vuex'
export default {
  name: 'DocumentList',
  components: {
    AppButtonsPanel,
    AppPartnerAutocomplete,
  },
  data: () => ({
    formName: 'DocumentList',
    settings: {
      search: null,
      partner: null,
      listOptions: {},
    },
    headers: [
      { value: 'partner', text: 'Партнер' },
      { value: 'name', text: 'Наименование' },
      { value: 'date', text: 'Дата', sortable: false },
      { value: 'useInTariff', text: 'Используется в тарифах', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['documents', 'loading', 'directoriesProfile']),
    prepareDocuments() {
      return this.documents
        .filter((i) =>
          this.settings.partner ? this.settings.partner === i.partner : true
        )
        .map((i) => ({
          ...i,
          partner: this.$store.getters.partnersMap.get(i.partner)?.name,
          date: i.date ? new Date(i.date).toLocaleDateString() : null,
        }))
    },
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getDocuments')
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
      this.$router.push({ name: 'DocumentCreate' })
    },
    refresh() {
      this.$store.dispatch('getDocuments', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`documents/${item._id}`)
    },
  },
}
</script>
<style scoped>
#settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
