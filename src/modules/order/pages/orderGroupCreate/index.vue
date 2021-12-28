<template>
  <div class="wrapper">
    <div class="settings">
      <app-date-range v-model="period" />
      <v-spacer />
      <div>Будет создано рейсов: {{ totalOrderCount }}</div>
      <v-btn
        small
        class="ml-3"
        @click="crearTable"
      >
        Очистить таблицу
      </v-btn>
    </div>
    <div
      v-if="isValidPeriod"
      class="table-wrapper"
    >
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">
                Шаблон
              </th>
              <th
                v-for="day of periodDays"
                :key="day.title"
                class="text-center column"
              >
                {{ day.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t of templates"
              :key="t"
            >
              <td>
                {{ templatesMap.get(t).name }}
                <v-icon
                  small
                  color="red"
                  class="ml-3"
                  @click="deleteTemplate(t)"
                >
                  mdi-delete
                </v-icon>
              </td>
              <td
                v-for="day of periodDays"
                :key="day.title"
              >
                <input
                  :value="orders[[t, day.date]]"
                  class="input"
                  align="right"
                  type="text"
                  @change="setOrder($event, [t, day.date])"
                >
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="bottom-panel">
        <v-autocomplete
          v-model="templateSearch"
          label="Добавить шаблон"
          dense
          hide-details
          :items="$store.getters.orderTemplatesForSelect"
        />
        <v-btn
          small
          color="primary"
          @click="addAllTemplates"
        >
          Добавить все шаблоны
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
import AppDateRange from '@/modules/common/components/dateRange'
export default {
  name: 'CreateOrderGroup',
  components: {
    AppDateRange,
  },
  data() {
    return {
      period: ['2021-12-27', '2021-12-31'],
      templates: [],
      templateSearch: null,
      orders: {},
    }
  },
  computed: {
    templatesMap() {
      return this.$store.getters.orderTemplatesMap
    },
    isValidPeriod() {
      if (this.period.filter((p) => !!p).length !== 2) return false
      if (new Date(this.period[0]) > new Date(this.period[1])) return false
      return true
    },
    periodDays() {
      if (!this.isValidPeriod) return null
      const days = getDaysFromPeriod(this.period)
      return days
    },
    totalOrderCount() {
      let val = 0
      const keys = Object.keys(this.orders)
      keys.forEach((k) => {
        val += parseInt(this.orders[k])
      })
      return val
    },
  },
  watch: {
    templateSearch(val) {
      if (val && !this.templates.includes(val)) {
        this.templates.push(val)
      }
      this.$nextTick(() => {
        this.templateSearch = null
      })
    },
    orders: {
      deep: true,
      handler: function (val) {
        console.log(val)
      },
    },
  },
  methods: {
    crearTable() {
      this.orders = Object.assign({})
    },
    deleteTemplate(t) {
      this.templates = this.templates.filter((item) => item !== t)
    },
    addAllTemplates() {
      this.templates = []
      this.templates = this.$store.getters.orderTemplates.map((i) => i._id)
    },
    setOrder(e, key) {
      this.orders = Object.assign({}, this.orders, { [key]: e.target.value })
    },
  },
}
</script>

<style scoped>
.wrapper {
  margin: 0px 50px;
}
.settings {
  display: flex;
  flex-direction: row;
  margin: 20px;
  align-items: center;
}

.input {
  width: 100%;
  text-align: center;
}
.title-column {
  width: 300px;
}
.column {
  width: 10rem;
}
.bottom-panel {
  margin-top: 30px;
  align-items: center;
  display: grid;
  grid-template-columns: 300px 250px;
  gap: 25px;
}
</style>
