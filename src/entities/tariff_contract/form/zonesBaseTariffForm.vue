<template>
  <form @submit.prevent="submitFormHandler">
    <v-card>
      <v-card-title>{{ formTitle }}</v-card-title>
      <v-card-text>
        <div class="input-fields-row">
          <v-select
v-model="form.truckKinds"
label="Тип ТС" :items="truckKindItems" multiple
/>
          <v-select
v-model="form.liftCapacities"
multiple label="Грузоподъемность" :items="liftCapacityItems"
/>
        </div>
        <div class="input-fields-row">
          <v-text-field v-model.number="form.includedPoints" label="Кол-во точек, включенных в тариф" />
          <v-text-field v-model.number="form.pointPrice" label="Тариф за доп.точку" />
        </div>
        <div class="input-fields-row">
          <v-autocomplete
            v-model="form.loadingZone"
            label="Зона погрузки"
            :items="zoneItems"
            itemValue="_id"
            itemTitle="name"
            autoSelectFirst
          />
          <v-autocomplete
            ref="NodeRef"
            v-model="form.unloadingZones"
            label="Зоны разгрузки"
            multiple
            :items="zoneItems"
            itemValue="_id"
            itemTitle="name"
            autoSelectFirst
            hint="Важна последовательность зон"
          />
        </div>

        <v-text-field v-model.number="form.price" label="Тариф" />
      </v-card-text>
      <CardActionButtons
        :submitDisabled="isInvalidForm"
        :submitBtnLabel="editableMode ? 'Сохранить' : 'Создать'"
        @submit="submitHandler"
        @cancel="cancelHandler"
      >
        <v-btn v-if="!editableMode" type="submit" color="primary"
:disabled="isInvalidForm">Добавить в список</v-btn>
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
    const { NodeRef, truckKindItems, liftCapacityItems, zoneItems, commonRules } = useFormHelpers()

    const form = ref(props.initialFormState ? props.initialFormState : defaultFormState())

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
      newState => {
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
      NodeRef.value.focus()
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
      NodeRef,
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
