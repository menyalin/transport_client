<template>
  <form @submit.prevent="submitFormHandler">
    <v-card>
      <v-card-title>{{ formTitle }}</v-card-title>
      <v-card-text>
        <div class="input-fields-row">
          <v-select
            ref="focusableNodeRef"
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
          <v-text-field label="Процент от базовой стоимости рейса" v-model.number="form.percent" />
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
import { required, numeric } from '@vuelidate/validators'
import { CardActionButtons } from '@/shared/ui'
import { useFormHelpers } from './useFormHelpers'

defineOptions({ name: 'ReturnPercentTariffForm' })

const props = defineProps({
  editableMode: Boolean,
  formTitle: String,
  initialFormState: Object,
})

const emit = defineEmits(['submit', 'add', 'cancel'])

const { truckKindItems, liftCapacityItems, commonRules, focusableNodeRef } = useFormHelpers()

const defaultFormState = () => ({
  truckKinds: [],
  liftCapacities: [],
  percent: null,
})

const form = ref(props.initialFormState ? props.initialFormState : defaultFormState())

const rules = {
  ...commonRules,
  percent: { required, numeric },
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
  clearForm()
  focusableNodeRef.value.focus()
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
