<template>
  <div>
    <v-simple-table dense class="mb-3">
      <template #default>
        <thead>
          <tr>
            <th class="date-col">Дата начала</th>
            <th class="date-col">Дата завершения</th>
            <th>Грузовик</th>
            <th>Прицеп</th>
            <th>Примечание</th>
            <th class="text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, ind) in items"
            :key="item._id || item.startDate"
            :class="{
              'not-saved-row': !item._id || item.updated,
            }"
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
                v-if="ind === items.length - 1 && crewEditable"
                color="green"
                class="px-1"
                @click="editItem"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="ind > 0 && ind === items.length - 1 && crewEditable"
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
              <DateTimeInput
                v-else
                v-model="$v.newItem.startDate.$model"
                class="my-2"
                label="Дата начала"
                hideDetails
                :minDate="minDateValue"
                type="datetime-local"
                :dense="true"
                :outlined="true"
                hide-details
              />
            </td>
            <td>
              <DateTimeInput
                v-if="newItem.startDate"
                v-model="newItem.endDate"
                class="my-2"
                label="Дата завершения"
                hideDetails
                :errorMessages="endDateErrors"
                :minDate="newItem.startDate"
                type="datetime-local"
                :dense="true"
                :outlined="true"
                hide-details
              />
            </td>
            <td class="truck-col">
              <v-autocomplete
                v-model="newItem.truck"
                :disabled="!isValidDate"
                class="pa-0 ma-0"
                :items="truckItems"
                hide-details
                auto-select-first
                item-value="_id"
                item-text="regNum"
              />
            </td>
            <td class="truck-col">
              <v-autocomplete
                v-model="newItem.trailer"
                :disabled="trailerDisabled"
                class="pa-0 ma-0"
                :items="trailerItems"
                auto-select-first
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
              <v-icon @click="cancelAddRow"> mdi-cancel </v-icon>
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

    <app-crew-message
      v-if="showTruckMessage"
      text="Грузовик задействован в активном экипаже от"
      :visibleDate="actualTruckCrew.transport.startDate"
      :date="newItem.startDate"
      :crew="actualTruckCrew"
      :transportId="actualTruckCrew.transport._id"
      :invalid="!truckClosureAvailable"
      type="transport"
      @clearCrew="clearTruckCrew"
    />

    <app-crew-message
      v-if="showTrailerMessage"
      text="Прицеп задействован в активном экипаже от"
      :visibleDate="actualTrailerCrew.transport.startDate"
      :date="newItem.startDate"
      :crew="actualTrailerCrew"
      :invalid="!trailerClosureAvailable"
      :transportId="actualTrailerCrew.transport._id"
      type="transport"
      @clearCrew="clearTrailerCrew"
    />

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
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { CrewService } from '@/shared/services'
import AppCrewMessage from './crewMessage.vue'
import { required } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'TransportTable',
  components: {
    DateTimeInput,
    AppCrewMessage,
  },
  props: {
    items: {
      type: Array,
    },
    date: {
      type: String,
    },
    crewEditable: {
      type: Boolean,
      default: true,
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
    truckItems: Array,
    trailerItems: Array,
    tkName: String,
  },
  data: () => ({
    editMode: false,
    actualTruckCrew: null,
    actualTrailerCrew: null,
    newItem: {
      startDate: null,
      endDate: null,
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
        endDate: {
          isLaterThan: isLaterThan(this.newItem.startDate),
        },
      },
    }
  },

  computed: {
    ...mapGetters(['trucks', 'allowedToUseTrailersTrucksSet']),

    allowUseTrailer() {
      return this.allowedToUseTrailersTrucksSet.has(this.newItem.truck)
    },
    isValidDate() {
      if (!this.items.length) return true
      else return !this.$v.newItem.startDate.$invalid
    },
    endDateErrors() {
      if (this.$v.newItem.endDate.$invalid) return ['Значение не корректно']
      else return null
    },
    isValidNewItem() {
      const fullCrew =
        (this.newItem.truck && this.allowUseTrailer && this.newItem.trailer) ||
        (this.newItem.truck && !this.allowUseTrailer && !this.newItem.trailer)
      const startDateValid =
        (this.items.length && !this.$v.newItem.startDate.$invalid) ||
        !this.items.length
      const truckAvailable = this.showTruckMessage
      const trailerAvailable = this.showTrailerMessage
      const validEndDate = !this.$v.newItem.endDate.$invalid
      return (
        fullCrew &&
        startDateValid &&
        !truckAvailable &&
        !trailerAvailable &&
        validEndDate
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
      if (!this.actualTruckCrew) return false
      const isClosedCrew = this.actualTruckCrew?.transport?.endDate
        ? new Date(this.actualTruckCrew.transport.endDate) <=
          new Date(this.newItem.startDate)
        : false
      return !isClosedCrew && this.actualTruckCrew._id !== this.crewId
    },
    showTrailerMessage() {
      if (!this.actualTrailerCrew || this.actualTrailerCrew._id === this.crewId)
        return false
      if (
        !!this.actualTrailerCrew.transport.endDate &&
        dayjs(this.actualTrailerCrew.transport.endDate).isSameOrBefore(
          this.newItem.startDate
        )
      )
        return false
      return true
    },
    trailerDisabled() {
      return (
        !this.allowUseTrailer ||
        (!!this.showTruckMessage && this.actualTruckCrew._id !== this.crewId)
      )
    },

    truckClosureAvailable() {
      if (!this.showTruckMessage) return false

      const isValidStartDateInOpenCrew =
        !this.actualTruckCrew.transport.endDate &&
        new Date(this.actualTruckCrew.transport.startDate) <
          new Date(this.newItem.startDate)

      const isValidStartDateinClosedCrew =
        this.actualTruckCrew.transport.endDate &&
        new Date(this.actualTruckCrew.transport.endDate) <
          new Date(this.newItem.startDate)

      return isValidStartDateInOpenCrew || isValidStartDateinClosedCrew
    },

    trailerClosureAvailable() {
      if (!this.showTrailerMessage) return false

      const isValidStartDateInOpenCrew =
        !this.actualTrailerCrew.transport.endDate &&
        new Date(this.actualTrailerCrew.transport.startDate) <
          new Date(this.newItem.startDate)

      const isValidStartDateinClosedCrew =
        this.actualTrailerCrew.transport.endDate &&
        new Date(this.actualTrailerCrew.transport.endDate) <
          new Date(this.newItem.startDate)

      return isValidStartDateInOpenCrew || isValidStartDateinClosedCrew
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
      if (!this.editMode) this.newItem.trailer = null
      this.actualTruckCrew = null
      if (!val) return null
      this.actualTruckCrew = await CrewService.getActualCrewByTruck(val)
    },
    ['newItem.trailer']: async function (val) {
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
    editItem() {
      const lastItem = this.items[this.items.length - 1]
      this.newItem.startDate = lastItem.startDate
      this.newItem.endDate = lastItem.endDate
      this.newItem.truck = lastItem.truck
      this.newItem.trailer = lastItem.trailer
      this.newItem.note = lastItem.note
      this.$emit('itemsPop')
      this.editMode = true
    },
    popItem() {
      this.$emit('itemsPop')
      if (this.items.length === 0) this.editMode = true
    },
    cancelAddRow() {
      this.editMode = false
      this.resetNewItem()
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
      this.newItem.startDate = null
      this.newItem.endDate = null
      this.newItem.truck = null
      this.newItem.trailer = null
      this.newItem.note = null
    },
    clearTruckCrew() {
      this.actualTruckCrew = null
    },
    clearTrailerCrew() {
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
.row-title-column {
  width: 8rem;
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
