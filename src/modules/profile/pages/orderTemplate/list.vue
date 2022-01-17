<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <v-text-field
            v-model="settings.search"
            label="Поиск"
            outlined
            dense
            hide-details
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="orderTemplates"
          :loading="loading"
          height="73vh"
          dense
          :search="settings.search"
          fixed-header
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderTemplateList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'OrderTemplateList',
    loading: false,
    settings: {
      search: null,
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },

    headers: [{ value: 'name', text: 'Название' }],
  }),
  computed: {
    ...mapGetters(['directoriesProfile', 'orderTemplates']),
  },

  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
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
      this.$router.push({ name: 'OrderTemplateCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`order_templates/${item._id}`)
    },
    getData() {
      this.$store.dispatch('getOrderTemplates')
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 300px 280px;
  align-items: center;
}
</style>
