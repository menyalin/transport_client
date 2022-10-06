<template>
  <v-dialog v-model="tmpDialog" max-width="800" persistent>
    <v-card>
      <v-card-title>Редактировать сумму</v-card-title>
      <v-card-text>
        <div class="form-wrapper">
          <div class="row">
            <v-select
              v-model="tmpItem.type"
              label="Тип затрат"
              :items="availablePriceTypes"
              hide-details
              dense
              outlined
              :style="{ 'max-width': '250px' }"
            />
            <v-text-field
              v-model.number="tmpItem.price"
              label="Сумма"
              hide-details
              outlined
              dense
              :style="{ 'max-width': '150px' }"
            />
            <v-checkbox
              v-if="allowedVat"
              v-model="tmpItem.withVat"
              :disabled="disabledVatRateCheckbox"
              label="c НДС"
              hide-details
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
          <div class="row">
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
        <v-btn @click="tmpDialog = false"> Отмена </v-btn>
        <v-btn color="primary" :disabled="!isValidNewPrice" @click="submit">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
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
      tmpDialog: false,
      tmpItem: {
        price: 0,
        type: null,
      },
    }
  },
  computed: {
    availablePriceTypes() {
      // return this.$store.getters.orderPriceTypes
      return this.$store.getters.orderPriceTypes
        .slice()
        .filter((t) => this.availibleTypes.includes(t.value))
    },
    disabledVatRateCheckbox() {
      return false
    },
    isValidNewPrice() {
      return +this.tmpItem.price > 0 && !!this.tmpItem.type
    },
  },
  watch: {
    dialog: {
      immediate: true,
      handler: function (val) {
        this.tmpDialog = val
      },
    },
    tmpDialog: function (val) {
      this.$emit('update:dialog', val)
    },
    item: {
      immediate: true,
      handler: function (val) {
        this.tmpItem = val
      },
    },
    tmpItem: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    submit() {
      this.$emit('save', { ...this.tmpItem })
      this.tmpDialog = false
    },
  },
}
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  gap: 15px;
  padding: 10px 30px;
}
</style>
