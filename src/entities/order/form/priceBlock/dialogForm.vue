<template>
  <v-dialog :model-value="dialog" @update:model-value="dialog = $event" max-width="800" persistent>
    <v-card>
      <v-card-title>Редактировать сумму</v-card-title>
      <v-card-text>
        <div class="form-wrapper">
          <v-alert :type="vatRateInfoDescription.type" class="mb-4">
            {{ vatRateInfoDescription.message }}
          </v-alert>
          <div class="fields-row">
            <v-select
              v-model="state.type"
              label="Тип затрат"
              :items="availablePriceTypes"
              clearable
              itemTitle="text"
              :style="{ 'max-width': '300px' }"
              :errorMessages="typeErrorMessages"
              @blur="v$.type.$touch()"
            />
            <v-text-field
              v-model="state.price"
              :label="priceWithVat ? 'Сумма с НДС' : 'Сумма без НДС'"
              type="number"
              :errorMessages="priceErrorMessages"
              :style="{ 'max-width': '200px' }"
              @blur="v$.price.$touch()"
            />
          </div>

          <div class="fields-row">
            <v-text-field v-model.lazy="state.note" label="Комментарий" hide-details />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel"> Отмена </v-btn>
        <v-btn color="primary" :disabled="isInvalidForm" @click="submit"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, decimal } from '@vuelidate/validators'

defineOptions({ name: 'DialogForm' })

const dialog = defineModel('dialog')

const props = defineProps({
  item: Object,
  vatRateInfo: {
    type: Object,
  },
  availibleTypes: {
    type: Array,
  },
})

const emit = defineEmits(['save'])

const store = useStore()

const state = ref({
  price: 0,
  type: '',
  note: '',
})

const rules = {
  price: { required, decimal },
  type: { required },
  note: {},
}

const v$ = useVuelidate(rules, state)

const availablePriceTypes = computed(() => {
  return props.availibleTypes
    ? store.getters.orderPriceTypes.slice().filter((t) => props.availibleTypes.includes(t.value))
    : []
})

const isInvalidForm = computed(() => v$.value.$invalid || props.vatRateInfo?.vatRate === undefined)

const priceErrorMessages = computed(() => {
  const errors = []
  if (v$.value.price.$dirty && v$.value.price.$invalid)
    errors.push('Сумма обязательна к заполнению')
  return errors
})

const typeErrorMessages = computed(() => {
  const errors = []
  if (v$.value.type.$dirty && v$.value.type.$invalid) errors.push('Укажите тип тарифа')
  return errors
})

const priceWithVat = computed(() => {
  return props.vatRateInfo?.usePriceWithVat && props.vatRateInfo?.vatRate > 0
})

const vatRateInfoDescription = computed(() => {
  if (props.vatRateInfo?.vatRate === undefined)
    return {
      type: 'error',
      message: 'Ставка НДС не определена!',
    }
  return {
    type: 'info',
    message: `Ставка НДС: ${props.vatRateInfo?.vatRate}%`,
  }
})

watch(
  () => props.item,
  (val) => {
    state.value = { ...val }
  },
  { immediate: true }
)

function submit() {
  emit('save', state.value)
  cancel()
}

function cancel() {
  dialog.value = false
  v$.value.$reset()
}
</script>

<style scoped>
.fields-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>
