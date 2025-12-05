<template>
  <EntityListWrapper>
    <ButtonsPanel
      panelType="list"
      :disabledSubmit="!$store.getters.hasPermission('orderTemplate:write')"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <v-text-field
:modelValue="settings.search"
label="Поиск" variant="outlined"
       density="compact"
hideDetails
/>
    </div>
    <v-data-table
      v-model:options="settings.listOptions"
      :headers="headers"
      :items="items"
      :loading="loading"
      height="73vh"
     
      :search="settings.search"
      fixedHeader
      :footerProps="{
        'items-per-page-options': [50, 100, -1],
      }"
      @dblclick:row="dblClickRow"
    />
  </EntityListWrapper>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { EntityListWrapper } from '@/shared/ui/index'
import { useListData } from './model'

export default {
  name: 'OrderTemplateList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
  },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('setFormSettings', {
        formName: this.formName,
        settings: { ...this.settings },
      })
      next()
    },
  setup() {
    const { items, headers } = useListData()
    return {
      items,
      headers,
    }
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

    created() {
      if (this.$store.getters.formSettingsMap.has(this.formName))
        this.settings = this.$store.getters.formSettingsMap.get(this.formName)
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
