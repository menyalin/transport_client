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
            outlined
            dense
            hide-details
            label="Тарифы на дату"
            type="date"
            :style="{ 'max-width': '180px' }"
          />
          <v-autocomplete
            v-model="settings.agreement"
            label="Соглашение"
            outlined
            dense
            :items="agreements"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '400px' }"
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
          <template v-slot:[`item.type`]="{ item }">
            <span>{{ downtimeTypesHash[item.type] }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
import service from '@/modules/profile/services/tariff.service'
import AgreementService from '@/modules/profile/services/agreement.service'

export default {
  name: 'TariffList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'tariffList',
    agreements: [],
    loading: false,
    settings: {
      agreement: null,
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    list: [],
    headers: [
      { value: 'date', text: 'Дата начала действия', sortable: true },
      { value: 'agreement.name', text: 'Соглашение', sortable: false },
      { value: 'note', text: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
    filteredList() {
      return this.list
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
    create() {
      this.$router.push({ name: 'TariffCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`tariffs/${item._id}`)
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
        this.list = data.items
        this.count = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
    async getAgreements() {
      this.agreements = await AgreementService.getActiveAgreements()
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
