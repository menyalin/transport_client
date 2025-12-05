<template>
  <div class="wrapper">
    <v-alert v-model="showAlert" type="info" class="my-4" closable>Рейсы успешно созданы</v-alert>
    <div class="settings">
      <DateRangeInput v-model="period" />
      <v-spacer />
      <div>Будет создано рейсов: {{ totalOrderCount }}</div>
      <v-btn :disabled="!totalOrderCount || loading" size="small" class="mx-3" @click="crearTable">
        Очистить таблицу
      </v-btn>
      <v-btn
        :disabled="!totalOrderCount || loading"
        :loading="loading"
        color="error"
        size="small"
        @click="createOrders"
      >
        Создать рейсы
      </v-btn>
    </div>
    <div v-if="isValidPeriod" class="table-wrapper">
      <v-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-center">Шаблон</th>
              <th v-for="day of periodDays" :key="day.title" class="text-center column">
                {{ day.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t of templates" :key="t">
              <td>
                {{ templatesMap.get(t).name }}
                <v-icon size="small" color="red" class="ml-3" @click="deleteTemplate(t)">mdi-delete</v-icon>
              </td>
              <td v-for="day of periodDays" :key="day.title">
                <input
                  :value="orders[[t, day.date]]"
                  class="input"
                  align="right"
                  type="text"
                  @change="setOrder($event, [t, day.date])"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
      <div class="bottom-panel">
        <v-autocomplete
          v-model="templateSearch"
          label="Добавить шаблон"
          hideDetails
          :items="$store.getters.orderTemplatesForSelect"
        />
        <v-btn size="small" color="primary" @click="addAllTemplates">Добавить все шаблоны</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
  import { OrderService } from '@/shared/services'
  import { DateRangeInput } from '@/shared/ui'

  export default {
    name: 'CreateOrderGroup',
    components: {
      DateRangeInput,
    },
    data() {
      return {
        period: this.initDateRange(),
        templates: [],
        templateSearch: null,
        orders: {},
        loading: false,
        showAlert: false,
      }
    },
    computed: {
      templatesMap() {
        return this.$store.getters.orderTemplatesMap
      },
      isValidPeriod() {
        if (this.period.filter(p => !!p).length !== 2) return false
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
        keys.forEach(k => {
          val += this.orders[k]
        })
        return val
      },
      preparedOrders() {
        let res = []
        const keys = Object.keys(this.orders)
        keys.forEach(key => {
          if (this.orders[key] !== 0) {
            res.push({
              template: key.split(',')[0],
              date: key.split(',')[1],
              count: this.orders[key],
            })
          }
        })
        return res
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
    },
    methods: {
      async createOrders() {
        const res = await this.$confirm('Вы уверены?')
        if (!res) return null
        try {
          this.loading = true
          await OrderService.createFromTemplate(this.preparedOrders)
          this.showAlert = true
          this.crearTable()
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.response?.data)
        }
      },
      crearTable() {
        this.orders = Object.assign({})
      },
      deleteTemplate(t) {
        this.templates = this.templates.filter(item => item !== t)
      },
      addAllTemplates() {
        this.templates = []
        this.templates = this.$store.getters.orderTemplates.map(i => i._id)
      },
      setOrder(e, key) {
        this.orders = Object.assign({}, this.orders, {
          [key]: parseInt(e.target.value) || 0,
        })
      },
      initDateRange() {
        const dateFormat = 'YYYY-MM-DD'
        const today = dayjs()
        return [today.add(1, 'd').format(dateFormat), today.add(8, 'd').format(dateFormat)]
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
