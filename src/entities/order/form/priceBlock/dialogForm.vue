<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>
        {{ 'Редактировать сумму' }}
      </v-card-title>
      <v-card-text>
        <div clas s="form-wrapper">
          <v-alert outlined :type="vatRateInfoDescription.type" dense>
            {{ vatRateInfoDescription.message }}
          </v-alert>
          <div class="fields-row">
            <v-select
              v-model="state.type"
              label="Тип затрат"
              :items="availablePriceTypes"
              dense
              outlined
              clearable
              :style="{ 'max-width': '300px' }"
              :errorMessages="typeErrorMessages"
              @blur="v$.type.$touch()"
            />
            <v-text-field
              v-model="state.price"
              :label="priceWithVat ? 'Сумма с НДС' : 'Сумма без НДС'"
              outlined
              dense
              type="number"
              :errorMessages="priceErrorMessages"
              :style="{ 'max-width': '200px' }"
              @blur="v$.price.$touch()"
            />
          </div>

          <div class="fields-row">
            <v-text-field
              v-model.lazy="state.note"
              label="Комментарий"
              outlined
              dense
              hide-details
            />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel"> Отмена </v-btn>
        <v-btn color="primary" :disabled="isInvalidForm" @click="submit">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, decimal } from '@vuelidate/validators'

export default {
  name: 'DialogForm',
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    dialog: Boolean,
    vatRateInfo: {
      type: Object,
    },
    availibleTypes: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
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
        ? proxy.$store.getters.orderPriceTypes
            .slice()
            .filter((t) => props.availibleTypes.includes(t.value))
        : []
    })

    const disabledVatRateCheckbox = computed(() => false)

    const isInvalidForm = computed(
      () => v$.value.$invalid || props.vatRateInfo?.vatRate === undefined
    )

    const priceErrorMessages = computed(() => {
      const errors = []
      if (v$.value.price.$dirty && v$.value.price.$invalid)
        errors.push('Сумма обязательна к заполнению')
      return errors
    })

    const typeErrorMessages = computed(() => {
      const errors = []
      if (v$.value.type.$dirty && v$.value.type.$invalid)
        errors.push('Укажите тип тарифа')
      return errors
    })

    const priceWithVat = computed(() => {
      return (
        props.vatRateInfo?.usePriceWithVat && props.vatRateInfo?.vatRate > 0
      )
    })

    const vatRateInfoDescription = computed(() => {
      if (!props.vatRateInfo?.vatRate === undefined)
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

    const submit = () => {
      emit('save', state.value)
      cancel()
    }

    const cancel = () => {
      emit('update:dialog', false)
      v$.value.$reset()
    }

    return {
      state,
      v$,
      availablePriceTypes,
      disabledVatRateCheckbox,
      isInvalidForm,
      priceErrorMessages,
      typeErrorMessages,
      priceWithVat,
      submit,
      cancel,
      vatRateInfoDescription,
    }
  },
}
</script>

<style scoped>
.fields-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
</style>
