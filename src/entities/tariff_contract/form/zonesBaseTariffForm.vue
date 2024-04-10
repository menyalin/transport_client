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
            v-model="v$.truckKinds.$model"
          />
          <v-select
            multiple
            label="Грузоподъемность"
            :items="liftCapacityItems"
            v-model="v$.liftCapacities.$model"
          />
        </div>
        <div class="input-fields-row">
          <v-autocomplete
            label="Зона погрузки"
            :items="zoneItems"
            item-value="_id"
            item-text="name"
            auto-select-first
            v-model="v$.loadingZone.$model"
          />
          <v-autocomplete
            ref="unloadingZoneRef"
            label="Зона разгрузки"
            :items="zoneItems"
            item-value="_id"
            item-text="name"
            auto-select-first
            v-model="v$.unloadingZone.$model"
          />
        </div>

        <v-text-field label="Тариф" v-model.number="v$.price.$model" />
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
import { computed, ref, watch, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, numeric } from '@vuelidate/validators'
import store from '@/store'
import { CardActionButtons } from '@/shared/ui'

const defaultFormState = {
  truckKinds: [],
  liftCapacities: [],
  loadingZone: null,
  unloadingZone: null,
  price: null,
}

export default {
  name: 'ZoneBaseTariffForm',
  components: {
    CardActionButtons,
  },
  props: {
    editableMode: Boolean,
    formTitle: String,
    initialFormState: {
      type: Object,
      default: () => defaultFormState,
    },
  },
  setup(props, ctx) {
    const unloadingZoneRef = ref(null)
    const form = reactive(Object.assign({}, props.initialFormState))
    const rules = {
      truckKinds: {
        required,
        minLength: minLength(1),
      },
      liftCapacities: {
        required,
        minLength: minLength(1),
      },
      loadingZone: { required },
      unloadingZone: { required },
      price: { required, numeric },
    }
    const v$ = useVuelidate(rules, form, { $stopPropagation: true })

    watch(
      () => props.initialFormState,
      (newState) => {
        if (newState) {
          Object.assign(form, newState)
          v$.value.$reset()
        }
      },
      { deep: true, immediate: true }
    )

    const zoneItems = computed(() => store.getters.zones)
    const truckKindItems = computed(() => store.getters.truckKinds)
    const liftCapacityItems = computed(() => store.getters.liftCapacityTypes)

    function submitHandler() {
      ctx.emit('submit', { ...form })
      clearForm()
    }
    function clearForm() {
      Object.assign(form, defaultFormState)
      v$.value.$reset()
    }

    function submitFormHandler() {
      ctx.emit('add', { ...form })
      form.price = null
      form.unloadingZone = null
      unloadingZoneRef.value.focus()
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
      unloadingZoneRef,
      v$,
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
