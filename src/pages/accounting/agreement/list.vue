<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('agreement:write')"
          @submit="create"
          @refresh="refresh"
        />
        <AgreementListSettings
          v-model:settings="settings"
          :clientItems="clientItems"
          :carrierItems="carrierItems"
        />

        <v-data-table-server
          :headers="headers"
          :items="filteredList"
          :items-length="count"
          :loading="loading"
          :page="listOptions.page"
          :items-per-page="listOptions.itemsPerPage"
          item-value="_id"
          height="73vh"
          fixed-header
          @update:options="updateListOptionsHandler"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.type`]="{ item }">
            <span>{{ downtimeTypesHash[item.type] }}</span>
          </template>
          <template #[`item.truck`]="{ item }">
            <span>{{ trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-' }}</span>
          </template>
          <template #[`item.startPositionDate`]="{ item }">
            <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
          </template>
          <template #[`item.endPositionDate`]="{ item }">
            <span>{{ new Date(item.endPositionDate).toLocaleString() }}</span>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { ButtonsPanel } from '@/shared/ui'
import { AgreementListSettings } from '@/entities/agreement'
import { usePartners } from '@/entities/partner'
import { AgreementService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

export default {
  name: 'AgreementListPage',
  components: {
    ButtonsPanel,
    AgreementListSettings,
  },
  setup() {
    const carrierStore = useCarrierStore()
    const { clients: clientItems } = usePartners()
    const { proxy } = getCurrentInstance()
    const loading = ref(false)
    const list = ref([])
    const count = ref(0)
    const listOptions = usePersistedRef({ page: 1, itemsPerPage: 25 }, 'agreement_list_options')
    const settings = usePersistedRef(
      { search: null, executor: null, clients: [], state: 'opened' },
      'agreement_list_settings'
    )

    const queryParams = computed(() => ({
      ...settings.value,
      company: proxy.$store.getters.directoriesProfile,
      limit: listOptions.value.itemsPerPage,
      skip: (listOptions.value.page - 1) * listOptions.value.itemsPerPage,
      sortBy: listOptions.value.sortBy?.length ? listOptions.value?.sortBy[0] : null,
      sortDesc: listOptions.value.sortDesc?.length ? listOptions.value.sortDesc[0] : null,
    }))

    async function getData() {
      try {
        loading.value = true
        const data = await AgreementService.getList(queryParams.value)
        list.value = data.items ?? []
        count.value = data.count ?? 0
      } catch (e) {
        proxy.$store.commit('setError', e.message)
      } finally {
        loading.value = false
      }
    }
    async function updateListOptionsHandler(options) {
      listOptions.value = options
      await getData()
    }

    async function refresh() {
      await getData()
    }

    watch(
      settings,
      () => {
        updateListOptionsHandler({ ...listOptions.value, page: 1 })
      },
      { deep: true }
    )

    return {
      updateListOptionsHandler,
      loading,
      listOptions,
      clientItems,
      settings,
      refresh,
      list,
      count,
      carrierItems: computed(() => carrierStore.carriers),
    }
  },
  data: () => ({
    headers: [
      { key: 'name', title: 'Название', sortable: false },
      {
        key: 'executorName',
        title: 'Наименование исполнителя',
        sortable: false,
      },
      { key: 'executorCarrierName', title: 'ТК исполнитель', sortable: false },
      { key: 'clientsName', title: 'Клиенты', sortable: false },
      { key: 'date', title: 'Дата начала действия', sortable: false },
      { key: 'endDate', title: 'Дата завершения', sortable: false },
      { key: 'note', title: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    filteredList() {
      if (!this.list) return []
      return this.list.map((i) => {
        return {
          ...i,
          date: new Date(i.date).toLocaleDateString(),
          endDate: i.endDate ? new Date(i.endDate).toLocaleDateString() : null,
        }
      })
    },
  },

  methods: {
    create() {
      this.$router.push({ name: 'AgreementCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`agreements/${item._id}`)
    },
  },
}
</script>
