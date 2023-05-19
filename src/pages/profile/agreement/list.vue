<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('agreement:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper" />

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
import { ButtonsPanel } from '@/shared/ui'
import { mapGetters } from 'vuex'
import { AgreementService } from '@/shared/services'

export default {
  name: 'AgreementList',
  components: {
    ButtonsPanel,
  },
  data: () => ({
    formName: 'agreementList',
    loading: false,
    settings: {
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    list: [],
    headers: [
      { value: 'name', text: 'Название', sortable: false },
      { value: 'date', text: 'Дата начала действия', sortable: true },
      { value: 'vatRateText', text: 'НДС', sortable: false },
      { value: 'note', text: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
    filteredList() {
      if (!this.list) return []
      return this.list.map((i) => {
        const vatRateText = this.$store.getters.vatRates.filter(
          (vR) => vR.value === i.vatRate
        )[0]?.text
        return {
          ...i,
          date: new Date(i.date).toLocaleDateString(),
          vatRateText,
        }
      })
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
      this.$router.push({ name: 'AgreementCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`agreements/${item._id}`)
    },
    async getData() {
      if (!this.directoriesProfile) {
        this.$router.push('/profile')
        return null
      }
      try {
        this.loading = true
        const data = await AgreementService.getList({
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
