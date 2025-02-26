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
          <v-text-field
            label="Кол-во точек, включенных в тариф"
            v-model.number="form.includedPoints"
          />
          <v-text-field
            label="Тариф за доп.точку"
            v-model.number="form.pointPrice"
          />
        </div>
        <div class="input-fields-row">
          <v-autocomplete
            label="Зона погрузки"
            :items="zoneItems"
            item-value="_id"
            item-text="name"
            auto-select-first
            v-model="form.loadingZone"
          />
          <v-autocomplete
            ref="focusableNodeRef"
            label="Зоны разгрузки"
            multiple
            :items="zoneItems"
            item-value="_id"
            item-text="name"
            auto-select-first
            v-model="form.unloadingZones"
            hint="Важна последовательность зон"
          />
        </div>

        <v-text-field label="Тариф" v-model.number="form.price" />
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
import { required, numeric } from '@vuelidate/validators'
import { CardActionButtons } from '@/shared/ui'
import { useFormHelpers } from './useFormHelpers'

const defaultFormState = () => ({
  truckKinds: [],
  liftCapacities: [],
  loadingZone: null,
  unloadingZones: [],
  price: null,
  includedPoints: 2,
  pointPrice: 0,
})

export default {
  name: 'ZonesBaseTariffForm',
  components: {
    CardActionButtons,
  },
  props: {
    editableMode: Boolean,
    formTitle: String,
    initialFormState: Object,
  },
  setup(props, ctx) {
    const {
      focusableNodeRef,
      truckKindItems,
      liftCapacityItems,
      zoneItems,
      commonRules,
    } = useFormHelpers()

    const form = ref(
      props.initialFormState ? props.initialFormState : defaultFormState()
    )

    const rules = computed(() => ({
      ...commonRules,
      loadingZone: { required },
      unloadingZones: { required },
      price: { required, numeric },
      includedPoints: { required, numeric },
      pointPrice: { required, numeric },
    }))
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
      ctx.emit('submit', { ...form.value })
      clearForm()
    }
    function clearForm() {
      form.value = defaultFormState()
      v$.value.$reset()
    }

    function submitFormHandler() {
      ctx.emit('add', { ...form.value })
      form.value.price = null
      form.value.unloadingZone = null
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
      zoneItems,
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
</style>
