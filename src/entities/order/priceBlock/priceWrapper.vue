<template>
  <div class="wrapper" :class="{ invalid: !isValid }">
    <div class="button-panel">
      <BlockTitle>{{ title }}</BlockTitle>
      <v-btn
        size="small"
        :disabled="readonly || !availibleTypes.length"
        variant="outlined"
        color="primary"
        @click="addNewItem"
      >
        Добавить сумму
      </v-btn>
    </div>
    <app-costs-table
      :value-model="items"
      :readonly="readonly"
      :basePrePrice="basePrePrice"
      :hidePrePrice="hidePrePrice"
      :usePriceWithVat="agreement.usePriceWithVAT ?? false"
      @edit-price="editPrice"
      @delete-price="deletePrice"
    />
    <app-dialog-form
      v-model:dialog="dialog"
      :item="editedItem"
      :allowedCashPayment="!!agreement.cashPayment"
      :allowedVat="agreement.vatRate !== 0"
      :availibleTypes="availibleTypes"
      @save="saveItem"
    />
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'
import AppCostsTable from './costsTable.vue'
import AppDialogForm from './dialogForm.vue'
import Price from './Price.class'

export default {
  name: 'PriceWrapper',
  components: {
    BlockTitle,
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
    isValid: { type: Boolean, default: true },
    agreement: Object,
    readonly: { type: Boolean, default: false },
    prePrices: Array,
    hidePrePrice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      editedItem: {
        type: null,
      },
    }
  },
  computed: {
    availibleTypes() {
      if (this.editedItem.type) return [this.editedItem.type]
      const usedTypes = this.items.map((i) => i.type)
      return this.$store.getters.orderPriceTypes
        .map((t) => t.value)
        .filter((t) => !usedTypes.includes(t))
    },
    basePrePrice() {
      return this.prePrices?.find((i) => i.type === 'base') || null
    },
  },

  methods: {
    clearEditedItem() {
      this.editedItem = Object.assign({}, {})
    },

    saveItem(val) {
      const priceItem = new Price(val, this.agreement.vatRate)
      const idx = this.items.findIndex((i) => i.type === priceItem.type)
      const tmpArr = this.items.slice()

      if (idx === -1) tmpArr.push(priceItem)
      else tmpArr.splice(idx, 1, priceItem)

      this.$emit('change', tmpArr)
      this.$nextTick(() => {
        this.clearEditedItem()
      })
    },

    addNewItem() {
      this.editedItem = {
        type: '',
        withVat: Boolean(this.agreement.usePriceWithVAT) || false,
        price: 0,
        cashPayment: this.agreement.cashPayment,
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    },

    async editPrice(type) {
      const item = this.items.find((i) => i.type === type)
      if (!item) return null

      this.editedItem = {
        ...item,
        withVat: Boolean(this.agreement.usePriceWithVAT),
        price: +(
          this.agreement.usePriceWithVAT ? item.price : item.priceWOVat
        ).toFixed(2),
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    },

    async deletePrice(type) {
      const idx = this.items.findIndex((i) => i.type === type)
      if (idx === -1) return null
      const res = await this.$dialog.confirm('Вы уверены?')
      if (res) {
        const tmpArr = this.items.slice()
        tmpArr.splice(idx, 1)
        this.$emit('change', tmpArr)
      }
    },
  },
}
</script>
<style scoped>
.button-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
</style>
