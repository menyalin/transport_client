<template>
  <div class="field-hint text-caption px-6">
    {{ `${text} ${crewDateStr}` }}
    <span class="link-text" @click="goto">Перейти</span>

    <span
      v-if="!isClosedCrew"
      class="link-text ml-3"
      :class="{
        'disabled-link': !date || !isValidNewDate,
      }"
      @click="closeCrewHandler"
    >
      Закрыть
    </span>
    <div v-if="!isValidNewDate" class="text-caption text-red">
      <b>Дата начала должна быть больше {{ crewLastDateStr }}</b>
    </div>
    <div>
      Водитель:
      {{ driversMap.has(crew.driver) ? driversMap.get(crew.driver).fullName : ' - ' }}
    </div>
    <div>
      Грузовик:
      {{ trucksMap.has(crew.transport.truck) ? trucksMap.get(crew.transport.truck).regNum : ' - ' }}
    </div>
    <div>
      Прицеп:
      {{ trucksMap.has(crew.transport.trailer) ? trucksMap.get(crew.transport.trailer).regNum : ' - ' }}
    </div>
  </div>
</template>
<script>
import { CrewService } from '@/shared/services'

export default {
  name: 'CrewMessage',
  props: {
    crew: Object,
    date: {
      // дата которой будет закрываться смена
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    lastDateInCrew() {
      const date = this.crew.transport.endDate || this.crew.transport.startDate
      return new Date(date)
    },
    crewLastDateStr() {
      return this.lastDateInCrew.toLocaleString()
    },
    isClosedCrew() {
      return !!this.crew.transport.endDate
    },
    isValidNewDate() {
      return !!this.date && +new Date(this.date) > +this.lastDateInCrew
    },
    driversMap() {
      return this.$store.getters.driversMap
    },
    trucksMap() {
      return this.$store.getters.trucksMap
    },
    crewDateStr() {
      const dateValue = this.type == 'crew' ? this.crew.startDate : this.crew.transport.startDate
      return new Date(dateValue).toLocaleString()
    },
    text() {
      switch (true) {
      case this.type === 'crew' && !this.crew.endDate:
            return 'У водителя есть открытая смена от '
      case this.type === 'crew' && !!this.crew.endDate:
        return 'У водителя есть пересечение со сменой от '
          case this.type === 'truck':
        return 'Грузовик используется в экипаже от '
          case this.type === 'trailer':
        return 'Прицеп используется в экипаже от '
      default:
        return 'какой-то другой вариант от '
      }
    },
  },
  methods: {
    async goto() {
      const res = await this.$confirm('Вы уверены? информация на странице будет потеряна')
      if (res)
        this.$router.push({
          name: 'CrewDetails',
          params: { id: this.crew._id },
        })
    },

    async closeCrewHandler() {
      if (!this.crew._id || !this.date || !this.isValidNewDate) return null

      const res = await CrewService.closeCrew(this.crew._id, this.date)
      if (res) this.$emit('clearCrew')
    },
  },
}
</script>
<style>
  .field-hint {
    margin: 0px auto 10px;
  }
  .link-text {
    color: red;
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
  }
  .disabled-link {
    color: grey;
    cursor: not-allowed;
  }
</style>
