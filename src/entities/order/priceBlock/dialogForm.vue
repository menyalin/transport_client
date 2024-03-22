<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>Редактировать сумму</v-card-title>
      <v-card-text>
        <div class="form-wrapper">
          <div class="fields-row">
            <v-select
              v-model="$v.tmpItem.type.$model"
              label="Тип затрат"
              :items="availablePriceTypes"
              dense
              outlined
              clearable
              :style="{ 'max-width': '300px' }"
              :errorMessages="typeErrorMessages"
              @blur="$v.tmpItem.type.$touch()"
            />
            <v-text-field
              v-model="$v.tmpItem.price.$model"
              label="Сумма"
              outlined
              dense
              type="number"
              :errorMessages="priceErrorMessages"
              :style="{ 'max-width': '200px' }"
              @blur="$v.tmpItem.price.$touch()"
            />
            <v-checkbox
              v-if="allowedVat"
              v-model="tmpItem.withVat"
              :disabled="disabledVatRateCheckbox"
              label="c НДС"
              dense
            />
            <v-checkbox
              v-if="allowedCashPayment"
              v-model="tmpItem.cashPayment"
              label="Оплата наличными"
              hide-details
              dense
            />
          </div>
          <div class="fields-row">
            <v-text-field
              v-model.lazy="tmpItem.note"
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
import { required, decimal } from 'vuelidate/lib/validators'
export default {
  name: 'DialogForm',
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    dialog: Boolean,
    allowedCashPayment: {
      type: Boolean,
      default: false,
    },
    allowedVat: {
      type: Boolean,
      default: false,
    },
    availibleTypes: {
      type: Array,
    },
  },
  data() {
    return {
      tmpItem: {
        price: 0,
        type: '',
      },
    }
  },
  validations: {
    tmpItem: {
      price: { required, decimal },
      type: { required },
    },
  },
  computed: {
    availablePriceTypes() {
      return this.$store.getters.orderPriceTypes
        .slice()
        .filter((t) => this.availibleTypes.includes(t.value))
    },
    disabledVatRateCheckbox() {
      return false
    },
    isInvalidForm() {
      return this.$v.$invalid
    },
    priceErrorMessages() {
      let errors = []
      if (this.$v.tmpItem.price.$dirty && this.$v.tmpItem.price.$invalid)
        errors.push('Сумма обязательна к заполнению')
      return errors
    },
    typeErrorMessages() {
      const errors = []
      if (this.$v.tmpItem.type.$dirty && this.$v.tmpItem.type.$invalid)
        errors.push('Укажите тип тарифа')
      return errors
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        this.tmpItem = val
      },
    },
  },
  methods: {
    submit() {
      this.$emit('save', this.tmpItem)
      this.cancel()
    },
    cancel() {
      this.$emit('update:dialog', false)
      this.$v.$reset()
    },
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
