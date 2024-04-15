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
          <v-autocomplete
            label="Зона погрузки"
            :items="zoneItems"
            item-value="_id"
            item-text="name"
            auto-select-first
            v-model="form.loadingZone"
          />
        </div>
        <div v-for="(_zone, idx) of form.zones" :key="idx" class="zone-row">
          <v-text-field
            v-model.number="form.zones[idx].distance"
            label="До, км"
            :style="{ 'max-width': '100px' }"
            dense
          />
          <v-text-field
            v-model.number="form.zones[idx].price"
            label="Тариф"
            dense
            :style="{ 'max-width': '160px' }"
          />
          <v-btn
            v-if="showDeleteBtn(idx)"
            icon
            small
            color="red"
            @click="deleteRow"
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
          <v-btn
            v-if="showAddBtn(idx) && !invalidZones"
            icon
            color="primary"
            @click="addRow"
          >
            <v-icon> mdi-plus-circle </v-icon>
          </v-btn>
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
import { required, minLength } from '@vuelidate/validators'
import store from '@/store'
import { CardActionButtons } from '@/shared/ui'

const defaultFormState = () => ({
  truckKinds: [],
  liftCapacities: [],
  loadingZone: null,
  zones: [{ distance: null, price: null }],
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
    const unloadingZoneRef = ref(null)
    const form = ref(
      props.initialFormState ? props.initialFormState : defaultFormState()
    )

    const rules = {
      truckKinds: { required, minLength: minLength(1) },
      liftCapacities: { required, minLength: minLength(1) },
      loadingZone: { required },
      zones: { required, minLength: minLength(1) },
    }
    const v$ = useVuelidate(rules, form, { $stopPropagation: true })

    watch(
      () => props.initialFormState,
      (newState) => {
        if (newState) {
          form.value = {
            ...newState,
            zones: [...newState.zones.map((zone) => Object.assign({}, zone))],
          }
          v$.value.$reset()
        }
      },
      { deep: true }
    )

    const zoneItems = computed(() => store.getters.zones)
    const truckKindItems = computed(() => store.getters.truckKinds)
    const liftCapacityItems = computed(() => store.getters.liftCapacityTypes)

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
      return form.value.zones.some((i) => !i.distance || !i.price)
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
      unloadingZoneRef,
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
