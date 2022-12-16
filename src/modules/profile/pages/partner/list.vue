<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('partner:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div id="settings-wrapper">
          <v-text-field
            v-model="settings.search"
            label="Поиск"
            outlined
            hide-details
            dense
            clearable
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="preparedPartners"
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
          <template #[`item.isClient`]="{ item }">
            <div>{{ item.isClient ? 'Да' : 'Нет' }}</div>
          </template>
          <template #[`item.created`]="{ item }">
            {{ new Date(item.createdAt).toLocaleString() }}
          </template>

          <template #[`item.updated`]="{ item }">
            {{ new Date(item.updatedAt).toLocaleString() }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { mapGetters } from 'vuex'
export default {
  name: 'PartnerList',
  components: {
    ButtonsPanel,
  },
  data: () => ({
    formName: 'PartnerList',
    settings: {
      search: null,
      listOptions: {},
    },
    headers: [
      { value: 'name', text: 'Наименование' },
      { value: 'group', text: 'Группа' },
      { value: 'inn', text: 'ИНН' },
      { value: 'isClient', text: 'Клиент' },
      { value: 'created', text: 'Дата создания', sortable: true },
      { value: 'updated', text: 'Дата изменения', sortable: true },
    ],
  }),
  computed: {
    ...mapGetters(['partners', 'loading', 'directoriesProfile']),
    preparedPartners() {
      return this.partners.map((i) => ({
        ...i,
        group: this.$store.getters.partnerGroupsMap.get(i.group),
        created: new Date(i.createdAt),
        updated: new Date(i.updatedAt),
      }))
    },
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getPartners')
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
      this.$router.push({ name: 'PartnerCreate' })
    },
    refresh() {
      this.$store.dispatch('getPartners', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`partners/${item._id}`)
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
