<template>
  <div>
    <v-simple-table
      dense
      class="mb-3"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="date-col">
              Дата начала
            </th>
            <th class="date-col">
              Дата завершения
            </th>
            <th>Грузовик</th>
            <th>Прицеп</th>
            <th>Примечание</th>
            <th class="text-center">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, ind) in items"
            :key="item._id || item.startDate"
            :class="{ 'not-saved-row': !item._id || item.updated }"
          >
            <td>
              {{ new Date(item.startDate).toLocaleString() }}
            </td>
            <td>
              {{
                item.endDate ? new Date(item.endDate).toLocaleString() : null
              }}
            </td>
            <td>
              {{
                $store.getters.truckById(item.truck)
                  ? $store.getters.truckById(item.truck).regNum
                  : null
              }}
            </td>
            <td>
              {{
                $store.getters.truckById(item.trailer)
                  ? $store.getters.truckById(item.trailer).regNum
                  : null
              }}
            </td>
            <td>
              {{ item.note }}
            </td>
            <td class="action-column text-center">
              <v-icon
                v-if="ind > 0 && ind === items.length - 1"
                color="red"
                class="px-1"
                @click="popItem"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
          <tr v-if="date && driver && editMode">
            <td class="date-col">
              <div v-if="fixedStartDateInRow">
                {{ new Date(newItem.startDate).toLocaleString() }}
              </div>
              <app-date-time-input
                v-else
                v-model="$v.newItem.startDate.$model"
                class="my-2"
                label="Дата начала"
                hideDetails
                :minDate="minDateValue"
              />
            </td>
            <td />
            <td class="truck-col">
              <v-select
                v-model="newItem.truck"
                :disabled="!isValidDate"
                class="pa-0 ma-0"
                :items="trucksByDriver"
                hide-details
                item-value="_id"
                item-text="regNum"
              />
            </td>
            <td class="truck-col">
              <v-select
                v-model="newItem.trailer"
                :disabled="trailerDisabled"
                class="pa-0 ma-0"
                :items="trailers"
                hide-details
                item-value="_id"
                item-text="regNum"
              />
            </td>
            <td>
              <v-text-field
                v-model="newItem.note"
                class="pa-0 ma-0"
                hide-details
              />
            </td>
            <td class="text-center action-column">
              <v-icon
                :color="isValidNewItem ? 'green' : 'grey'"
                @click="addItem"
              >
                mdi-content-save
              </v-icon>
              <v-icon @click="cancelAddRow">
                mdi-cancel
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div
      v-if="editMode && !$v.newItem.startDate.isLaterThan"
      class="text-caption error-message"
    >
      Начальная дата должна быть больше
      {{ new Date(minDateValue).toLocaleString() }}
    </div>
    <div
      v-if="!!truckErrorMessage"
      class="text-caption error-message"
    >
      {{ truckErrorMessage }}
    </div>
    <app-crew-message
      v-if="showTruckMessage"
      text="Грузовик задействован в активном экипаже от"
      :visibleDate="actualTruckCrew.transport.startDate"
      :date="newItem.startDate"
      :crewId="actualTruckCrew._id"
      :transportId="actualTruckCrew.transport._id"
      type="transport"
      @clearCrew="clearTruckCrew"
    />
    <!-- <div
      v-if="trailerError"
      class="text-caption error-message"
    >
      {{ trailerError }}
    </div>
    <app-crew-message
      v-if="
        actualTrailerCrew && !trailerError && actualTrailerCrew._id !== crewId
      "
      text="Прицеп задействован в активном экипаже от"
      :visibleDate="actualTrailerCrew.transport.startDate"
      :date="newItem.startDate"
      :crewId="actualTrailerCrew._id"
      :transportId="actualTrailer.transport._id"
      type="transport"
      @clearCrew="clearTrailerCrew"
    /> -->

    <v-btn
      v-if="showAddRowBtn"
      text
      class="ma-3"
      color="green"
      small
      @click="addRow"
    >
      Добавить запись
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import CrewService from '@/modules/profile/services/crew.service'
import AppCrewMessage from './crewMessage.vue'
import { required } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'

export default {
  name: 'TransportTable',
  components: {
    AppDateTimeInput,
    AppCrewMessage,
  },
  props: {
    items: {
      type: Array,
    },
    date: {
      type: String,
    },
    isClosedCrew: {
      type: Boolean,
      required: true,
    },
    driver: {
      type: String,
    },
    crewId: {
      type: String,
    },
    tkName: String,
  },
  data: () => ({
    editMode: false,
    truckError: null,
    trailerError: null,
    actualTruckCrew: null,
    actualTrailerCrew: null,
    newItem: {
      startDate: null,
      truck: null,
      trailer: null,
      note: null,
    },
  }),

  validations() {
    return {
      newItem: {
        startDate: {
          required,
          isLaterThan: isLaterThan(this.minDateValue),
        },
      },
    }
  },

  computed: {
    ...mapGetters(['trucks', 'allowedToUseTrailersTrucksSet']),
    trucksByDriver() {
      if (!this.driver) return []
      return this.trucks.filter((truck) =>
        truck?.allowedDrivers?.includes(this.driver)
      )
    },
    trailers() {
      return this.trucks.filter(
        (truck) => truck.type === 'trailer' && truck.tkName._id === this.tkName
      )
    },
    allowUseTrailer() {
      return this.allowedToUseTrailersTrucksSet.has(this.newItem.truck)
    },
    isValidDate() {
      if (!this.items.length) return true
      else return !this.$v.newItem.startDate.$invalid
    },
    isValidNewItem() {
      const fullCrew =
        (this.newItem.truck && this.allowUseTrailer && this.newItem.trailer) ||
        (this.newItem.truck && !this.allowUseTrailer && !this.newItem.trailer)
      const startDateValid =
        (this.items.length && !this.$v.newItem.startDate.$invalid) ||
        !this.items.length
      return (
        !this.truckError && !this.trailerError && fullCrew && startDateValid
      )
    },
    minDateValue() {
      if (!this.items.length) return null
      return this.items[this.items.length - 1].endDate
        ? this.items[this.items.length - 1].endDate
        : this.items[this.items.length - 1].startDate
    },
    fixedStartDateInRow() {
      const idx = this.items.length - 1
      if (idx < 0) return true
      return !!this.items[idx].endDate
    },
    showAddRowBtn() {
      return !this.editMode && !this.isClosedCrew
    },
    showTruckMessage() {
      if (!this.actualTruckCrew || this.truckErrorMessage) return false
      const isClosedCrew = this.actualTruckCrew?.transport?.endDate
        ? new Date(this.actualTruckCrew.transport.endDate) <
          new Date(this.newItem.startDate)
        : false
      return !isClosedCrew && this.actualTruckCrew._id !== this.crewId
    },
    truckErrorMessage() {
      if (!this.actualTruckCrew) return null
      if (
        !this.actualTruckCrew.transport.endDate &&
        new Date(this.actualTruckCrew.transport.startDate) >
          new Date(this.newItem.startDate)
      )
        return `Дата начала работы экипажа должна быть больше ${new Date(
          this.actualTruckCrew.transport.startDate
        ).toLocaleString()}`
      if (
        new Date(this.actualTruckCrew.transport.endDate) >
        new Date(this.newItem.startDate)
      )
        return `Грузовик задействован в другом экипаже до ${new Date(
          this.actualTruckCrew.transport.endDate
        ).toLocaleString()}`
      else return null
    },
    trailerDisabled() {
      return (
        !this.allowUseTrailer ||
        (!!this.showTruckMessage && this.actualTruckCrew._id !== this.crewId)
      )
    },
  },

  watch: {
    editMode: function (val) {
      this.$emit('editMode', val)
    },
    date: function (val) {
      if (!this.items.length) this.newItem.startDate = val
      this.newItem.truck = null
    },
    ['newItem.truck']: async function (val) {
      this.newItem.trailer = null
      this.truckError = null
      this.actualTruckCrew = null
      if (!val) return null
      this.actualTruckCrew = await CrewService.getActualCrewByTruck(val)
    },
    ['newItem.trailer']: async function (val) {
      this.trailerError = null
      this.actualTrailerCrew = null
      if (!val) return null
      this.actualTrailerCrew = await CrewService.getActualCrewByTruck(val)
    },
  },
  mounted() {
    if (!this.items.length) {
      this.newItem.startDate = this.date
      this.editMode = true
    }
  },
  methods: {
    popItem() {
      this.$emit('itemsPop')
      if (this.items.length === 0) this.editMode = true
    },
    cancelAddRow() {
      this.editMode = false
    },
    addItem() {
      if (!this.isValidNewItem) return null
      this.$emit('addItem', { ...this.newItem })
      this.$nextTick(() => {
        this.resetNewItem()
      })
    },
    addRow() {
      this.editMode = true
      this.newItem.startDate = this.getStartDateRow()
      this.newItem.truck = null
      this.newItem.trailer = null
      this.newItem.note = null
    },
    resetNewItem() {
      this.editMode = false
    },
    clearTruckCrew() {
      this.truckError = null
      this.actualTruckCrew = null
    },
    clearTrailerCrew() {
      this.trailerError = null
      this.actualTrailerCrew = null
    },
    getStartDateRow() {
      if (!this.items.length) return this.date
      const idx = this.items.length - 1
      return this.items[idx].endDate ? this.items[idx].endDate : null
    },
  },
}
</script>
<style>
.date-col {
  width: 12rem;
}
.truck-col {
  width: 25rem;
}
.not-saved-row {
  color: rgb(138, 13, 13);
}
.action-column {
  width: 10rem;
}
.action-column > * {
  padding: 10px 5px;
}
.error-message {
  padding: 5px;
  font-size: 2rem;
  color: red;
}
</style>
