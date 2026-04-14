<template>
  <v-card>
    <v-card-title>
      {{ item ? 'Редактирование' : 'Создание' }} транспортной накладной
    </v-card-title>
    <v-card-text class="form-wrapper">
      <v-radio-group
        v-model="form.shipperAddressId"
        @change="changeShipperAddressHandler"
      >
        <template v-slot:label>
          <div><b>Грузоотправитель</b></div>
        </template>
        <v-radio
          v-for="item in shipperAddressItems"
          :key="item.id"
          :value="item.value"
          :label="item.text"
        />
      </v-radio-group>

      <v-radio-group v-model="form.consigneeAddressId">
        <template v-slot:label>
          <div><b>Грузополучатель</b></div>
        </template>
        <v-radio
          v-for="item in consigneeAddressItems"
          :key="item.id"
          :value="item.value"
          :label="item.text"
        />
      </v-radio-group>

      <div class="inputs-row">
        <v-text-field
          label="Номер ТрН"
          v-model="v$.number.$model"
          dense
          outlined
          required
          @blur="v$.number.$touch"
          :error-messages="getErrorMessage(v$.number)"
        />
        <DateTimeInput
          label="Дата накладной"
          v-model="v$.date.$model"
          dense
          outlined
          required
          :error-messages="getErrorMessage(v$.date)"
          :style="{ maxWidth: '200px' }"
          @blur="v$.date.$touch"
        />
      </div>
      <v-textarea
        label="Накладные"
        auto-grow
        rows="3"
        v-model="v$.docsDescription.$model"
        outlined
        dense
        @blur="v$.note.$touch"
        :error-messages="getErrorMessage(v$.docsDescription)"
      />
      <v-textarea
        label="Примечание"
        auto-grow
        rows="3"
        v-model="v$.note.$model"
        outlined
        dense
        @blur="v$.note.$touch"
        :error-messages="getErrorMessage(v$.note)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn color="primary" :disabled="v$.$invalid" @click="submit">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'TransportWaybillForm',
  components: {
    DateTimeInput,
  },
  props: {
    shipperAddressItems: Array,
    consigneeAddressItems: Array,
    isVisible: Boolean,
    item: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const initialState = {
      number: null,
      shipperAddressId: null,
      consigneeAddressId: null,
      date: null,
      docsDescription: null,
      note: null,
    }

    const form = ref({})

    const rules = computed(() => ({
      number: { required },
      date: { required },
      shipperAddressId: { required },
      consigneeAddressId: { required },
      docsDescription: { required },
      note: {},
    }))

    const v$ = useVuelidate(rules, form)
    function resetForm() {
      form.value = { ...initialState }
      v$.value.$reset()
    }
    function setFormState(args) {
      const [newState, isVisible] = args

      if (!isVisible) {
        resetForm()
        return
      }

      if (
        !form.value.shipperAddressId &&
        props.shipperAddressItems?.length === 1
      )
        form.value = {
          ...form.value,
          shipperAddressId: props.shipperAddressItems[0].value,
          date: props.shipperAddressItems[0].date,
        }

      if (
        !form.value.consigneeAddressId &&
        props.consigneeAddressItems.length === 1
      ) {
        form.value = {
          ...form.value,
          consigneeAddressId: props.consigneeAddressItems[0].value,
        }
      }

      form.value = { ...initialState, ...form.value, ...(newState ?? {}) }
    }

    const getErrorMessage = (field) => {
      if (!field.$dirty) return []
      return field.$errors.map((error) => error.$message)
    }

    const cancel = () => {
      emit('cancel')
    }

    const submit = () => emit('submit', { ...form.value })

    function changeShipperAddressHandler(addressId) {
      const addressItem = props.shipperAddressItems.find(
        (i) => i.value === addressId
      )
      if (!addressItem) return
      form.value = { ...form.value, date: addressItem.date }
    }

    watch([() => props.item, () => props.isVisible], setFormState, {
      deep: true,
      immediate: true,
    })

    return {
      form,
      v$,
      getErrorMessage,
      cancel,
      submit,
      changeShipperAddressHandler,
    }
  },
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.inputs-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
