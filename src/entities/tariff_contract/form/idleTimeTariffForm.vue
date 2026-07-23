<template>
  <form @submit.prevent="submitFormHandler">
    <v-card>
      <v-card-title>{{ formTitle }}</v-card-title>
      <v-card-text>
        <div class="input-fields-row">
          <v-select
            label="Тип ТС"
            :items="truckKindItems"
            multiple
            item-title="text"
            item-value="value"
            v-model="form.truckKinds"
          />
          <v-select
            multiple
            label="Грузоподъемность"
            :items="liftCapacityItems"
            v-model="form.liftCapacities"
          />
        </div>
        <div class="input-fields-row">
          <v-select
            multiple
            ref="focusableNodeRef"
            label="Тип рейса"
            :items="orderTypeItems"
            item-title="text"
            item-value="value"
            v-model="form.orderTypes"
            :style="{ width: '130px' }"
          />
          <v-text-field
            label="Часы простоя, включенные в тариф"
            v-model.number="form.includeHours"
          />
          <v-select
            label="Округлять до"
            :items="roundingIntervalItems"
            item-title="text"
            item-value="value"
            v-model="form.roundingInterval"
            :style="{ width: '150px' }"
          />
          <v-select
            label="Тариф за"
            :items="tariffByItems"
            item-title="text"
            item-value="value"
            v-model="form.tariffBy"
            :style="{ width: '150px' }"
          />
        </div>
        <div class="input-fields-row">
          <v-text-field label="Тариф" v-model.number="form.price" />
        </div>
      </v-card-text>
      <CardActionButtons
        :submitDisabled="isInvalidForm"
        :submitBtnLabel="editableMode ? 'Сохранить' : 'Создать'"
        @submit="submitHandler"
        @cancel="cancelHandler"
      >
        <v-btn v-if="!editableMode" type="submit" color="primary" :disabled="isInvalidForm">
          Добавить в список
        </v-btn>
      </CardActionButtons>
    </v-card>
  </form>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minLength } from '@vuelidate/validators'
import { CardActionButtons } from '@/shared/ui'
import { useFormHelpers } from './useFormHelpers'

defineOptions({ name: 'AdditionalPointsTariffForm' })

const props = defineProps({
  editableMode: Boolean,
  formTitle: String,
  initialFormState: Object,
})

const emit = defineEmits(['submit', 'add', 'cancel'])

const {
  focusableNodeRef,
  truckKindItems,
  liftCapacityItems,
  orderTypeItems,
  commonRules,
  tariffByItems,
  roundingIntervalItems,
} = useFormHelpers()

const defaultFormState = () => ({
  truckKinds: [],
  liftCapacities: [],
  orderTypes: [],
  includeHours: null,
  roundingInterval: null,
  tariffBy: null,
  price: null,
})

const form = ref(props.initialFormState ? props.initialFormState : defaultFormState())

const rules = {
  ...commonRules,
  orderTypes: { required, minLength: minLength(1) },
  includeHours: { required, numeric },
  roundingInterval: { required },
  tariffBy: { required },
  price: { required, numeric },
}
const v$ = useVuelidate(rules, form, { $stopPropagation: true })

watch(
  () => props.initialFormState,
  (newState) => {
    if (newState) {
      form.value = { ...newState }
      v$.value.$reset()
    }
  },
  { deep: true }
)

function submitHandler() {
  emit('submit', form.value)
  clearForm()
}

function clearForm() {
  form.value = defaultFormState()
  v$.value.$reset()
}

function submitFormHandler() {
  emit('add', form.value)
  form.value.orderTypes = []
  form.value.includeHours = null
  form.value.roundingInterval = null
  form.value.tariffBy = null
  form.value.price = null
  v$.value.$reset()
}

function cancelHandler() {
  emit('cancel')
  clearForm()
  v$.value.$reset()
}

const isInvalidForm = computed(() => {
  return v$.value.$invalid
})
</script>
<style scoped>
.input-fields-row {
  display: flex;
  flex-direction: row;
  gap: 30px;
}
.zone-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
</style>
