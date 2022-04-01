<template>
  <div>
    <div id="button-panel">
      <app-block-title>{{ title }}</app-block-title>
      <v-btn
        small
        text
        :disabled="readonly || !availibleTypes.length"
        outlined
        color="primary"
        @click="addNewItem"
      >
        Добавить сумму
      </v-btn>
    </div>
    <app-costs-table
      v-model="items"
      :readonly="readonly"
      @editPrice="editPrice"
      @deletePrice="deletePrice"
    />
    <app-dialog-form
      v-model="editedItem"
      :dialog.sync="dialog"
      :allowedCashPayment="!!agreement.cashPayment"
      :allowedVat="agreement.vatRate !== 0"
      :availibleTypes="availibleTypes"
      @save="saveItem"
    />
  </div>
</template>
<script>
import AppBlockTitle from '../blockTitle.vue'
import AppCostsTable from './costsTable.vue'
import AppDialogForm from './dialogForm.vue'
import Price from './Price.class'

export default {
  name: 'PriceWrapper',
  components: {
    AppBlockTitle,
    AppCostsTable,
    AppDialogForm,
  },
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    title: String,
    items: Array,
    agreement: Object,
    readonly: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
      editedItem: {
        type: null,
      },
      tmpItems: [],
    }
  },
  computed: {
    availibleTypes() {
      if (!!this.editedItem.type) return [this.editedItem.type]
      const usedTypes = this.tmpItems.map((i) => i.type)
      return this.$store.getters.orderPriceTypes
        .map((t) => t.value)
        .filter((t) => !usedTypes.includes(t))
    },
  },
  watch: {
    items: {
      immediate: true,
      handler: function (val) {
        this.tmpItems = val
      },
    },
    tmpItems: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    clearEditedItem() {
      this.editedItem = Object.assign({}, {})
    },
    saveItem(val) {
      const priceItem = new Price(val, this.agreement.vatRate)
      const idx = this.tmpItems.findIndex((i) => i.type === priceItem.type)
      idx !== -1
        ? this.tmpItems.splice(idx, 1, { ...priceItem })
        : this.tmpItems.push({ ...priceItem })
      this.clearEditedItem()
    },
    addNewItem() {
      this.editedItem = Object.assign(
        {},
        {
          withVat: this.agreement.vatRate !== 0,
          price: 0,
          cashPayment: this.agreement.cashPayment,
        }
      )
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    async editPrice(type) {
      const idx = this.tmpItems.findIndex((i) => i.type === type)
      if (idx === -1) return null
      this.editedItem = Object.assign(
        {},
        {
          type: this.tmpItems[idx].type,
          withVat: this.agreement.vatRate !== 0,
          price:
            this.agreement.vatRate !== 0
              ? this.tmpItems[idx].price
              : this.tmpItems[idx].priceWOVat,
          note: this.tmpItems[idx].note,
          cashPayment: this.tmpItems[idx].cashPayment,
        }
      )
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    async deletePrice(type) {
      const idx = this.tmpItems.findIndex((i) => i.type === type)
      if (idx === -1) return null
      const res = await this.$confirm('Вы уверены?')
      if (res) this.tmpItems = this.tmpItems.splice(idx, 1)
    },
  },
}
</script>
<style scoped>
#button-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
