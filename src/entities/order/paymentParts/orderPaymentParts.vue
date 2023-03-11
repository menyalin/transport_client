<template>
  <div class="docs-wrapper">
    <h5>Деление стоимости рейса:</h5>
    <div class="btn-wrapper">
      <v-btn text small color="primary" outlined @click="openDialog">
        Добавить часть
      </v-btn>
    </div>
    <payment-parts-table :items="parts" @deleteRow="deleteRowHandler" />
    <payment-part-form-dialog
      :routeDate="routeDate"
      :dialog="dialog"
      @submit="submitHandler"
      @close="closeDialog"
    />
  </div>
</template>
<script>
import PaymentPartFormDialog from './formDialog.vue'
import PaymentPartsTable from './paymentPartsTable.vue'
import { PaymentPart } from './model/paymentPart.class'

export default {
  name: 'OrderPaymentParts',
  components: {
    PaymentPartFormDialog,
    PaymentPartsTable,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
    },
    routeDate: { type: String },
    readonly: {
      type: Boolean,
    },
  },
  data() {
    return {
      parts: [],
      dialog: false,
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return null
        this.parts = val
      },
    },
    parts: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    submitHandler(formState) {
      const part = new PaymentPart(formState)
      this.parts.push(part)
      this.closeDialog()
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    deleteRowHandler(idx) {
      this.parts.splice(idx, 1)
    },
  },
}
</script>
<style scoped>
.docs-wrapper {
  margin: 5px;
  padding: 15px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  margin: 10px;
}
.not-accepted {
  background-color: rgba(255, 0, 0, 0.4);
}
</style>
