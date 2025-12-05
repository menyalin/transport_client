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
          <v-text-field v-model.number="v$.includedPoints.$model" label="Кол-во точек, включенных в тариф" />
          <v-text-field v-model.number="v$.pointPrice.$model" label="Тариф за доп.точку" />
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
        </div>
        <div v-for="(_zone, idx) of form.zones" :key="idx" class="zone-row">
          <v-text-field
            v-model.number="form.zones[idx].distance"
            label="До, км"
            :style="{ 'max-width': '100px' }"
           
          />
          <v-text-field
            v-model.number="form.zones[idx].price"
            label="Тариф"
           
            :style="{ 'max-width': '160px' }"
          />
          <v-btn v-if="showDeleteBtn(idx)" icon size="small" color="red" @click="deleteRow">
            <v-icon size="small">mdi-delete</v-icon>
          </v-btn>
          <v-btn v-if="showAddBtn(idx) && !invalidZones" icon color="primary"
@click="addRow">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </div>
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
import { required, minLength, numeric } from '@vuelidate/validators'
import { CardActionButtons } from '@/shared/ui'
import { useFormHelpers } from './useFormHelpers'

const defaultFormState = () => ({
  truckKinds: [],
  liftCapacities: [],
  loadingZone: null,
  zones: [{ distance: null, price: null }],
  includedPoints: 2,
  pointPrice: 0,
})

export default {
  name: 'DirectDistanceZonesTariffForm',
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

    const rules = {
      ...commonRules,
      loadingZone: { required },
      zones: { required, minLength: minLength(1) },
      includedPoints: { required, numeric },
      pointPrice: { required, numeric },
    }
    const v$ = useVuelidate(rules, form, { $stopPropagation: true })

    watch(
      () => props.initialFormState,
      newState => {
        if (newState) {
          form.value = {
            ...newState,
            zones: [...newState.zones.map(zone => Object.assign({}, zone))],
          }
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
      clearForm()
    }

    function cancelHandler() {
      ctx.emit('cancel')
      clearForm()
      v$.value.$reset()
    }

    const isInvalidForm = computed(() => {
      return v$.value.$invalid || invalidZones.value
    })

    const invalidZones = computed(() => {
      if (!form.value.zones || form.value.zones.length === 0) return true
      return form.value.zones.some(i => !i.distance || !i.price)
    })

    function showDeleteBtn(idx) {
      return form.value.zones.length > 1 && form.value.zones.length === idx + 1
    }

    function showAddBtn(idx) {
      return form.value.zones.length === idx + 1
    }

    function addRow() {
      form.value.zones.push({
        distance: null,
        price: null,
      })
    }

    function deleteRow() {
      form.value.zones.pop()
    }

    return {
      truckKindItems,
      liftCapacityItems,
      zoneItems,
      submitHandler,
      submitFormHandler,
      cancelHandler,
      form,
      isInvalidForm,
      NodeRef,
      v$,
      showDeleteBtn,
      showAddBtn,
      invalidZones,
      deleteRow,
      addRow,
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
import { numeric } from '@vuelidate/validators'
