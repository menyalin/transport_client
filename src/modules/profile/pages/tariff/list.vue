<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('tariff:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <v-text-field
            v-model="settings.date"
            outlined
            dense
            clearable
            hide-details
            label="Тарифы на дату"
            type="date"
            :style="{ 'max-width': '220px' }"
          />

          <v-autocomplete
            v-model="settings.agreement"
            label="Соглашение"
            outlined
            clearable
            dense
            :items="agreements"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '300px' }"
          />
          <v-autocomplete
            v-model="settings.document"
            label="Документ"
            outlined
            clearable
            dense
            :items="$store.getters.documents"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '300px' }"
          />
          <v-select
            v-model="settings.type"
            :items="$store.getters.tariffTypes"
            outlined
            clearable
            dense
            hide-details
            label="Тип тарифа"
            :style="{ 'max-width': '180px' }"
          />
          <v-autocomplete
            v-model="settings.client"
            label="Заказчик"
            outlined
            clearable
            dense
            :items="clients"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '250px' }"
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
          <template v-slot:[`item._result`]="{ item }">
            <app-waiting-cell
              v-if="item.type === 'waiting'"
              :item="item"
            />
            <app-additional-points-cell
              v-else-if="item.type === 'additionalPoints'"
              :item="item"
            />
            <app-return-cell
              v-else-if="item.type === 'return'"
              :item="item"
            />
            <div v-else>
              {{ item._result }}
            </div>
          </template>
        </v-data-table>
        <app-tariff-form
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
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTariffForm from '@/modules/profile/components/tariffForm'
import AppWaitingCell from '@/modules/profile/components/tariffGroupList/waiting.vue'
import AppReturnCell from '@/modules/profile/components/tariffGroupList/return.vue'
import AppAdditionalPointsCell from '@/modules/profile/components/tariffGroupList/additionalPoints.vue'
import { mapGetters } from 'vuex'
import service from '@/modules/profile/services/tariff.service'
import AgreementService from '@/modules/profile/services/agreement.service'

export default {
  name: 'TariffList',
  components: {
    AppButtonsPanel,
    AppTariffForm,
    AppWaitingCell,
    AppAdditionalPointsCell,
    AppReturnCell,
  },
  data: () => ({
    formName: 'tariffList',
    dialog: false,
    editableItem: {},
    agreements: [],
    loading: false,
    settings: {
      type: null,
      date: null,
      document: null,
      agreement: null,
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    list: [],
    headers: [
      {
        value: '_date',
        text: 'Дата начала действия',
        sortable: false,
        align: 'right',
      },
      { value: 'agreement.name', text: 'Соглашение', sortable: false },
      { value: '_document', text: 'Документ', sortable: false },
      { value: '_type', text: 'Тип', sortable: false },
      { value: '_result', text: 'Параметры', sortable: false },

      {
        value: '_truckKind',
        text: 'Вид ТС',
        sortable: false,
      },
      {
        value: 'liftCapacity',
        text: 'Грузоподъемность',
        sortable: false,
      },
      {
        value: '_price',
        text: 'Тариф с НДС',
        sortable: false,
        align: 'right',
      },
      {
        value: '_priceWOVat',
        text: 'Тариф без НДС',
        sortable: false,
        align: 'right',
      },
      { value: 'note', text: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
    filteredList() {
      return this.list.map((i) => ({
        ...i,
        _type: this.$store.getters.tariffTypesMap.get(i.type),
        _document:
          this.$store.getters.documentsMap.get(i.document)?.name || null,
        _date: new Date(i.date).toLocaleDateString(),
        _truckKind: this.$store.getters.truckKindsMap.get(i.truckKind),
        _price: new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(i.price),
        _priceWOVat: new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
        }).format(i.priceWOVat),
        _result: this.getResultStrByType(i),
      }))
    },
    clients() {
      return this.$store.getters.partners.filter((i) => i.isClient)
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
    this.getAgreements()
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
        case 'points':
          const _loadingStr =
            this.$store.getters.addressMap.get(item.loading)?.shortName ||
            this.$store.getters.addressMap.get(item.loading)?.name
          const _unloadingStr =
            this.$store.getters.addressMap.get(item.unloading)?.shortName ||
            this.$store.getters.addressMap.get(item.unloading)?.name

          return _loadingStr + '  >>>  ' + _unloadingStr

        case 'directDistanceZones':
          return `Погрузка: ${
            this.$store.getters.addressMap.get(item.loading).shortName
          } , до ${item.maxDistance}км`
        default:
          return '-'
      }
    },
    create() {
      this.$router.push({ name: 'TariffCreate' })
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
        const data = await service.getList({
          company: this.directoriesProfile,
          date: this.settings.date,
          type: this.settings.type,
          agreement: this.settings.agreement,
          document: this.settings.document,
          client: this.settings.client,
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

    async getAgreements() {
      this.agreements = await AgreementService.getActiveAgreements()
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
        const updatedItem = await service.updateOne({
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
