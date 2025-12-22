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
        <AgreementListSettings v-model="settings" :clientItems="clientItems" />

        <v-data-table
          :headers="headers"
          :items="filteredList"
          :loading="loading"
          height="73vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.type`]="{ item }">
            <span>{{ downtimeTypesHash[item.type] }}</span>
          </template>
          <template #[`item.truck`]="{ item }">
            <span>{{
              trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-'
            }}</span>
          </template>
          <template #[`item.startPositionDate`]="{ item }">
            <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
          </template>
          <template #[`item.endPositionDate`]="{ item }">
            <span>{{ new Date(item.endPositionDate).toLocaleString() }}</span>
          </template>
        </v-data-table>
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

export default {
  name: 'AgreementListPage',
  components: {
    ButtonsPanel,
    AgreementListSettings,
  },
  setup() {
    const { clients: clientItems } = usePartners()
    const { proxy } = getCurrentInstance()
    const loading = ref(false)
    const list = ref([])
    const count = ref(0)
    const listOptions = usePersistedRef(
      {
        page: 1,
      },
      'agreement_list_options'
    )
    const settings = usePersistedRef(
      { search: null, executor: null, client: null },
      'agreement_list_settings'
    )
    const queryParams = computed(() => ({
      company: proxy.$store.getters.directoriesProfile,
      skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
      executor: settings.value.executor,
      clients: settings.value.clients,
      search: settings.value.search,
      limit: listOptions.value.itemsPerPage,
      sortBy: listOptions.value.sortBy.length
        ? listOptions.value.sortBy[0]
        : null,
      sortDesc: listOptions.value.sortDesc.length
        ? listOptions.value.sortDesc[0]
        : null,
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

    async function refresh() {
      await getData()
    }

    watch(
      settings,
      () => {
        listOptions.value = { ...listOptions.value, page: 1 }
      },
      { deep: true }
    )
    watch(
      listOptions,
      async () => {
        await getData()
      },
      { deep: true }
    )

    return {
      loading,
      listOptions,
      clientItems,
      settings,
      refresh,
      list,
      count,
    }
  },
  data: () => ({
    headers: [
      { value: 'name', text: 'Название', sortable: false },
      {
        value: 'executorName',
        text: 'Наименование исполнителя',
        sortable: false,
      },
      { value: 'executorCarrierName', text: 'ТК исполнитель', sortable: false },
      { value: 'clientsName', text: 'Клиенты', sortable: false },
      { value: 'date', text: 'Дата начала действия', sortable: true },
      { value: 'endDate', text: 'Дата завершения', sortable: false },
      { value: 'vatRateText', text: 'НДС', sortable: false },
      { value: 'note', text: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    filteredList() {
      if (!this.list) return []
      return this.list.map((i) => {
        const vatRateText = this.$store.getters.vatRates.filter(
          (vR) => vR.value === i.vatRate
        )[0]?.text
        return {
          ...i,
          date: new Date(i.date).toLocaleDateString(),
          endDate: i.endDate ? new Date(i.endDate).toLocaleDateString() : null,
          vatRateText,
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
