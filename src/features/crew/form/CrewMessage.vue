<template>
  <div class="field-hint text-body-small px-6">
    {{ `${text} ${crewDateStr}` }}
    <span class="link-text" @click="goto"> Перейти </span>

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
    <div class="text-body-small text-red" v-if="!isValidNewDate">
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
      {{
        trucksMap.has(crew.transport.trailer) ? trucksMap.get(crew.transport.trailer).regNum : ' - '
      }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CrewService } from '@/shared/services'

defineOptions({ name: 'CrewMessage' })

const props = defineProps({
  crew: Object,
  date: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['clearCrew'])

const router = useRouter()
const store = useStore()

const lastDateInCrew = computed(() => {
  const date = props.crew.transport.endDate || props.crew.transport.startDate
  return new Date(date)
})
const crewLastDateStr = computed(() => lastDateInCrew.value.toLocaleString())
const isClosedCrew = computed(() => !!props.crew.transport.endDate)
const isValidNewDate = computed(() => !!props.date && +new Date(props.date) > +lastDateInCrew.value)
const driversMap = computed(() => store.getters.driversMap)
const trucksMap = computed(() => store.getters.trucksMap)

const crewDateStr = computed(() => {
  const dateValue = props.type === 'crew' ? props.crew.startDate : props.crew.transport.startDate
  return new Date(dateValue).toLocaleString()
})

const text = computed(() => {
  switch (true) {
    case props.type === 'crew' && !props.crew.endDate:
      return 'У водителя есть открытая смена от '
    case props.type === 'crew' && !!props.crew.endDate:
      return 'У водителя есть пересечение со сменой от '
    case props.type === 'truck':
      return 'Грузовик используется в экипаже от '
    case props.type === 'trailer':
      return 'Прицеп используется в экипаже от '
    default:
      return 'какой-то другой вариант от '
  }
})

async function goto() {
  const res = await confirm('Вы уверены? информация на странице будет потеряна')
  if (res) {
    router.push({
      name: 'CrewDetails',
      params: { id: props.crew._id },
    })
  }
}

async function closeCrewHandler() {
  if (!props.crew._id || !props.date || !isValidNewDate.value) return null

  const res = await CrewService.closeCrew(props.crew._id, props.date)
  if (res) emit('clearCrew')
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
