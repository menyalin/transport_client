<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabledSubmit="!$store.getters.hasPermission('orderTemplate:write')"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <v-text-field
        v-model="settings.search"
        label="Поиск"
        variant="outlined"
        density="compact"
        hide-details
      />
    </div>
    <v-data-table
      v-model:options="settings.listOptions"
      :headers="headers"
      :items="items"
      :loading="loading"
      height="73vh"
      density="compact"
      :search="settings.search"
      fixed-header
      :footer-props="{
        'items-per-page-options': [50, 100, -1],
      }"
      @dblclick:row="dblClickRow"
    />
  </entity-list-wrapper>
</template>
<script>
import { ButtonsPanel , EntityListWrapper } from '@/shared/ui'
import { useListData } from './model'

export default {
  name: 'OrderTemplateList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
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
  }),
  setup() {
    const { items, headers } = useListData()
    return {
      items,
      headers,
    }
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
