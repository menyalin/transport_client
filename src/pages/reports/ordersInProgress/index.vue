<template>
  <v-container>
    <v-row>
      <v-col>
        <ReportTitle title="Простой транспорта" />
        <div id="report-settings">
          <v-btn icon @click.stop="getData">
            <v-icon> mdi-cached </v-icon>
          </v-btn>
          <v-text-field
            v-model.trim="settings.search"
            label="Поиск"
            hideDetails
            outlined
            dense
            :style="{ 'max-width': '300px' }"
          />
          <v-checkbox
            v-model="settings.selectedOnly"
            label="Только выделенные"
            hideDetails
            dense
            class="py-0 my-0"
          />
          <v-spacer />
          <v-btn
            v-if="showCopyButton"
            text
            color="primary"
            small
            @click="copyHandler"
          >
            скопировать в буфер
          </v-btn>
        </div>
        <v-data-table
          v-model="settings.selected"
          :itemKey="'_id'"
          :singleSelect="false"
          :headers="headers"
          :items="filteredRows"
          :loading="loading"
          :search="settings.search"
          fixed-header
          height="76vh"
          dense
          show-select
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ReportService } from '@/shared/services'
import { ReportTitle } from '@/shared/ui'
export default {
  name: 'OrdersInProgress',
  components: {
    ReportTitle,
  },
  data() {
    return {
      formName: 'OrdersInProgressReport',
      loading: false,
      settings: {
        search: null,
        selected: [],
        selectedOnly: false,
      },
      rows: [],
      headers: [
        { value: 'clientName', text: 'Заказчик' },
        { value: 'date', text: 'Дата рейса' },
        { value: 'loadingPoints', text: 'Погрузка' },
        { value: 'unloadingPoints', text: 'Разгрузка' },
        { value: 'truckNum', text: 'Грузовик' },
        { value: 'trailerNum', text: 'Прицеп' },
        { value: 'driverName', text: 'Водитель' },
        { value: 'driverPhone', text: 'Телефон' },
        { value: 'state', text: 'Статус' },
        { value: 'address', text: 'Адрес' },
      ],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    filteredRows() {
      return this.rows
        .filter((item) => {
          if (!this.settings.selectedOnly) return true
          return this.settings.selected.map((s) => s._id).includes(item._id)
        })
        .map((item) => ({
          ...item,
          date: new Date(item.plannedDate).toLocaleDateString(),
          state: item.state === 'loading' ? 'На погрузке' : 'На выгрузке',
          address: item.currentPoint.name,
        }))
    },
    showCopyButton() {
      return !!window.ClipboardItem
    },
  },
  watch: {
    ['settings.dayCount']: {
      deep: true,
      handler: function () {
        this.getData()
      },
    },
  },
  async mounted() {
    await this.getData()
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: this.settings,
    })
    next()
  },
  methods: {
    getTableForClipboard() {
      // if (this.filteredRows.length === 0) return null

      let resStr = '<html><body><table style="border-collapse: collapse;">'
      resStr +=
        '<tr>' +
        this.headers.reduce((accum, item) => {
          return (accum += `<th style="border: 1px solid gray; font-size: 12px; padding: 3px;">${item.text}</th>`)
        }, '') +
        '</tr>'

      for (let i = 0; i < this.filteredRows.length; i++) {
        resStr +=
          '<tr>' +
          this.headers.reduce((accum, item) => {
            return (accum += `<td style="border: 1px solid gray; font-size: 12px; padding: 3px;">
            ${this.filteredRows[i][item.value]}
            </td>`)
          }, '') +
          '</tr>'
      }

      return resStr + '</table></body></html>'
    },
    dblClickRow(_, { item }) {
      this.$router.push(`/orders/${item._id}`)
    },
    async getData() {
      this.loading = true
      this.rows = await ReportService.ordersInProgress({
        profile: this.directoriesProfile,
      })
      this.loading = false
    },
    copyHandler() {
      const text = this.getTableForClipboard()
      var data = [
        // eslint-disable-next-line no-undef
        new ClipboardItem({
          'text/html': new Blob([text], { type: 'text/html' }),
        }),
      ]
      navigator.clipboard.write(data).then()
    },
  },
}
</script>
<style scoped>
#report-settings {
  display: flex;
  flex-direction: row;
  align-items: center;
}
#report-settings > * {
  margin: 10px;
}
.v-data-table {
  white-space: nowrap;
}
</style>
