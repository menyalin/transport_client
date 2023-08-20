<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('salaryTariff:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <app-table-column-settings
            v-model="activeHeaders"
            :allHeaders="allHeaders"
            :listSettingsName="listSettingsName"
          />
          <v-text-field
            v-model="settings.date"
            type="date"
            outlined
            dense
            hide-details
            label="Тарифы на дату"
            :style="{ 'max-width': '220px' }"
          />
          <v-select
            v-model="settings.tk"
            label="ТК"
            :items="$store.getters.tkNamesForSelect"
            dense
            outlined
            clearable
            hide-details
            :style="{ 'max-width': '220px' }"
          />
          <v-select
            v-model="settings.type"
            :items="$store.getters.salaryTariffTypes"
            outlined
            clearable
            dense
            hide-details
            label="Тип тарифа"
            :style="{ 'max-width': '250px' }"
          />
          <v-select
            v-model="settings.liftCapacity"
            :items="$store.getters.liftCapacityTypes"
            outlined
            clearable
            dense
            hide-details
            label="Грузоподъемность"
            :style="{ 'max-width': '180px' }"
          />
        </div>

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
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item._result`]="{ item }">
            <app-zones-cell v-if="item.type === 'zones'" :item="item" />
            <app-regions-cell
              v-else-if="item.type === 'regions'"
              :item="item"
            />
            <app-waiting-cell
              v-else-if="item.type === 'waiting'"
              :item="item"
            />
            <app-return-cell v-else-if="item.type === 'return'" :item="item" />
            <div v-else>
              {{ item._result }}
            </div>
          </template>
        </v-data-table>
        <app-salary-tariff-form
          v-model="editableItem"
          :dialog="dialog"
          @cancel="cancelDialog"
          @update="updateItem"
          @deletedItem="deletedItem"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import AppSalaryTariffForm from '@/modules/accounting/components/salaryTariffForm/index.vue'
import { SalaryTariffService } from '@/shared/services'
import { mapGetters } from 'vuex'
import { useListColumnSetting } from '@/shared/hooks'
import { ALL_LIST_HEADERS, DEFAULT_HEADERS } from './constants'
import AppZonesCell from '@/modules/accounting/components/salaryTariffGroupList/zones'
import AppRegionsCell from '@/modules/accounting/components/salaryTariffGroupList/regions'
import AppWaitingCell from '@/modules/accounting/components/salaryTariffGroupList/waiting.vue'
import AppReturnCell from '@/modules/accounting/components/salaryTariffGroupList/return.vue'
import { ButtonsPanel } from '@/shared/ui'

export default {
  name: 'SalaryTariffList',
  components: {
    ButtonsPanel,
    AppTableColumnSettings,
    AppSalaryTariffForm,
    AppZonesCell,
    AppRegionsCell,
    AppWaitingCell,
    AppReturnCell,
  },

  setup() {
    const { listSettingsName, activeHeaders, allHeaders, headers } =
      useListColumnSetting({
        listSettingsName: 'salaryTariffList',
        defaultHeaders: DEFAULT_HEADERS,
        allHeaders: ALL_LIST_HEADERS,
      })

    return {
      listSettingsName,
      activeHeaders,
      allHeaders,
      headers,
    }
  },
  data: () => ({
    formName: 'salaryTariffList',
    dialog: false,
    editableItem: {},
    loading: false,
    settings: {
      type: null,
      date: null,
      tk: null,
      liftCapacity: null,
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    list: [],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),

    filteredList() {
      return this.list.map((i) => ({
        ...i,
        _type: this.$store.getters.salaryTariffTypesMap.get(i.type),
        _date: new Date(i.date).toLocaleDateString(),
        _result: this.getResultStrByType(i),
        _tks: i.tks
          .map((tkId) => this.$store.getters.tkNamesMap.get(tkId).name)
          .join(', '),
        _sum: Intl.NumberFormat().format(i.sum),
        _clients: i.clients
          ?.map((client) => this.$store.getters.partnersMap.get(client)?.name)
          .join(', '),
        _consigneeTypes: i.consigneeTypes
          ?.map((type) => this.$store.getters.partnerGroupsMap.get(type))
          .join(', '),
        _liftCapacity: i.liftCapacity.join(', '),
      }))
    },
  },
  watch: {
    settings: {
      deep: true,
      handler: function () {
        this.getData()
      },
    },
  },
  async created() {
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
    getResultStrByType(item) {
      switch (item.type) {
        case 'points': {
          const loadingStr =
            this.$store.getters.addressMap.get(item.loading)?.shortName ||
            this.$store.getters.addressMap.get(item.loading)?.name
          const unloadingStr =
            this.$store.getters.addressMap.get(item.unloading)?.shortName ||
            this.$store.getters.addressMap.get(item.unloading)?.name

          return loadingStr + '  >>>  ' + unloadingStr
        }

        case 'directDistanceZones':
          return `Погрузка: ${
            this.$store.getters.addressMap.get(item.loading).shortName
          } , до ${item.maxDistance}км`
        default:
          return '-'
      }
    },
    create() {
      this.$router.push({ name: 'SalaryTariffCreate' })
    },

    refresh() {
      this.getData()
    },

    dblClickRow(_, { item }) {
      const cleanItem = this.list.find((i) => i._id === item._id)
      this.editableItem = { ...cleanItem }
      this.$nextTick(() => {
        this.dialog = true
      })
    },

    async getData() {
      if (!this.directoriesProfile) {
        this.$router.push('/profile')
        return null
      }
      try {
        this.loading = true
        const data = await SalaryTariffService.getList({
          company: this.directoriesProfile,
          date: this.settings.date,
          type: this.settings.type,
          tk: this.settings.tk,
          liftCapacity: this.settings.liftCapacity,
          skip:
            this.settings.listOptions.itemsPerPage *
            (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
          sortBy: this.settings.listOptions.sortBy.length
            ? this.settings.listOptions.sortBy[0]
            : null,
          sortDesc: this.settings.listOptions.sortDesc.length
            ? this.settings.listOptions.sortDesc[0]
            : null,
        })
        if (data.count) {
          this.list = data.items
          this.count = data.count
        } else {
          this.list = []
          this.count = 0
        }

        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },

    cancelDialog() {
      this.dialog = false
    },
    deletedItem(id) {
      this.list = this.list.filter((i) => i._id !== id)
      this.$nextTick(() => {
        this.cancelDialog()
      })
    },
    async updateItem(item) {
      try {
        this.loading = true
        const updatedItem = await SalaryTariffService.updateOne({
          _id: item._id,
          body: item,
        })
        this.loading = false
        const idx = this.list.findIndex((i) => i._id === item._id)
        if (idx !== -1) this.list.splice(idx, 1, updatedItem)
        this.dialog = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
