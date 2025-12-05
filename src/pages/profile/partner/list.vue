<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledRefresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('partner:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="settings-wrapper">
          <v-select
            :modelValue="settings.partnerType"
            variant="outlined"
       density="compact"
            :items="partnerTypeItems"
            hideDetails
           
            :style="{ 'max-width': '400px' }"
          />
          <v-text-field
            :modelValue="settings.search"
            label="Поиск"
            variant="outlined"
       density="compact"
            hideDetails
           
            clearable
          />
        </div>
        <v-data-table
          v-model:options="listOptions"
          :headers="headers"
          :items="filteredPartners"
          :loading="loading"
          fixedHeader
          :search="settings.search"
          height="73vh"
         
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
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
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { ButtonsPanel } from '@/shared/ui'
import { getCurrentInstance, computed } from 'vue'
import { mapGetters } from 'vuex'
export default {
  name: 'PartnerList',
  components: {
    ButtonsPanel,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const settings = usePersistedRef({ search: null, partnerType: 'all' }, 'PartnerList:settings')

    const listOptions = usePersistedRef(
      { page: 1, itemsPerPage: 50, sortBy: [], sortDesc: [] },
      'PartnerList:listOptions'
    )
    const partnerTypeItems = [
      { value: 'all', text: 'Все' },
      { value: 'client', text: 'Заказчик' },
      { value: 'service', text: 'Сервис' },
    ]
    const partnerTypeCondition = partner => {
      if (settings.value.partnerType === 'client') return partner.isClient
      if (settings.value.partnerType === 'service') return partner.isService
      return true
    }

    const filteredPartners = computed(() => {
      return proxy.$store.getters.partners.filter(partnerTypeCondition).map(i => ({
        ...i,
        group: proxy.$store.getters.partnerGroupsMap.get(i.group),
        created: new Date(i.createdAt),
        updated: new Date(i.updatedAt),
      }))
    })
    return {
      listOptions,
      settings,
      partnerTypeItems,
      filteredPartners,
    }
  },
  data: () => ({
    headers: [
      { value: 'name', text: 'Наименование' },
      { value: 'group', text: 'Группа' },
      { value: 'inn', text: 'ИНН' },
      { value: 'isClient', text: 'Заказчик' },
      { value: 'created', text: 'Дата создания', sortable: true },
      { value: 'updated', text: 'Дата изменения', sortable: true },
    ],
  }),
  computed: {
    ...mapGetters(['loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getPartners')
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
  .settings-wrapper {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding-bottom: 20px;
  }
</style>
