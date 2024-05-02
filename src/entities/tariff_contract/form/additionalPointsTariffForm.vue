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
            v-model="form.orderTypes"
          />
          <v-text-field
            label="Кол-во точек включенных базовый тариф"
            v-model.number="form.includedPoints"
          />
        </div>
        <div class="input-fields-row">
          <v-text-field
            label="Тариф за каждую дополнительную точку"
            v-model.number="form.price"
          />
        </div>
      </v-card-text>
      <CardActionButtons
        :submitDisabled="isInvalidForm"
        :submitBtnLabel="editableMode ? 'Сохранить' : 'Создать'"
        @submit="submitHandler"
        @cancel="cancelHandler"
      >
        <v-btn
          v-if="!editableMode"
          type="submit"
          color="primary"
          :disabled="isInvalidForm"
        >
          Добавить в список
        </v-btn>
      </CardActionButtons>
    </v-card>
  </form>
</template>
<script>
import { computed, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minLength } from '@vuelidate/validators'
import { CardActionButtons } from '@/shared/ui'
import { useFormHelpers } from './useFormHelpers'

/*
  truckKinds: TRUCK_KINDS_ENUM[]
  liftCapacities: number[]
  includedPoints: number
  price: number
  orderType: OrderType

*/

export default {
  name: 'AdditionalPointsTariffForm',
  components: {
    CardActionButtons,
  },
  props: {
    editableMode: Boolean,
    formTitle: String,
    initialFormState: Object,
  },
  setup(props, ctx) {
    const defaultFormState = () => ({
      truckKinds: [],
      liftCapacities: [],
      orderTypes: [],
      includedPoints: null,
      price: null,
    })

    const {
      truckKindItems,
      liftCapacityItems,
      orderTypeItems,
      commonRules,
      focusableNodeRef,
    } = useFormHelpers()

    const form = ref(
      props.initialFormState ? props.initialFormState : defaultFormState()
    )

    const rules = {
      ...commonRules,
      orderTypes: { required, minLength: minLength(1) },
      includedPoints: { required, numeric },
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
      ctx.emit('submit', form.value)
      clearForm()
    }
    function clearForm() {
      form.value = defaultFormState()
      v$.value.$reset()
    }

    function submitFormHandler() {
      ctx.emit('add', form.value)
      form.value.orderTypes = []
      form.value.includedPoints = null
      form.value.price = null
      v$.value.$reset()
      focusableNodeRef.value.focus()
    }

    function cancelHandler() {
      ctx.emit('cancel')
      clearForm()
      v$.value.$reset()
    }

    const isInvalidForm = computed(() => {
      return v$.value.$invalid
    })

    return {
      truckKindItems,
      liftCapacityItems,
      orderTypeItems,
      submitHandler,
      submitFormHandler,
      cancelHandler,
      form,
      isInvalidForm,
      v$,
      focusableNodeRef,
    }
  },
}
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
