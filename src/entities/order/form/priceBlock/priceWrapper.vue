<template>
  <CardSection :title="title" :valid="valid">
    <template #header>
      <v-btn
        size="small"
        :disabled="readonly || !availibleTypes.length"
        color="primary"
        @click="addNewItem"
      >
        Добавить сумму
      </v-btn>
    </template>
    <app-costs-table
      :items="modelValue"
      :readonly="readonly"
      :basePrePrice="basePrePrice"
      :hidePrePrice="hidePrePrice"
      :usePriceWithVat="agreement.usePriceWithVAT ?? false"
      @editPrice="editPrice"
      @deletePrice="deletePrice"
    />
    <app-dialog-form
      v-model:dialog="dialog"
      :item="editedItem"
      :vatRateInfo="vatRateInfo"
      :availibleTypes="availibleTypes"
      @save="saveItem"
    />
  </CardSection>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { CardSection } from '@/shared/ui'
import AppCostsTable from './costsTable.vue'
import AppDialogForm from './dialogForm.vue'
import { Price } from './Price.class'

defineOptions({ name: 'PriceWrapper' })

const modelValue = defineModel()

const props = defineProps({
  title: String,
  valid: { type: Boolean, default: true },
  agreement: Object,
  readonly: { type: Boolean, default: false },
  prePrices: Array,
  vatRateInfo: {
    type: Object,
  },
  hidePrePrice: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()

const dialog = ref(false)
const editedItem = ref({
  type: null,
  price: 0,
})

const availibleTypes = computed(() => {
  if (editedItem.value.type) return [editedItem.value.type]
  const usedTypes = modelValue.value.map((i) => i.type)
  return store.getters.orderPriceTypes.map((t) => t.value).filter((t) => !usedTypes.includes(t))
})

const basePrePrice = computed(() => {
  return props.prePrices?.find((i) => i.type === 'base') || null
})

function clearEditedItem() {
  editedItem.value = { type: null, price: 0 }
}

function saveItem(val) {
  if (!props.vatRateInfo) return
  const priceItem = new Price(val, props.vatRateInfo)

  const idx = modelValue.value.findIndex((i) => i.type === priceItem.type)
  const tmpArr = modelValue.value.slice()

  if (idx === -1) tmpArr.push(priceItem)
  else tmpArr.splice(idx, 1, priceItem)

  modelValue.value = tmpArr
  nextTick(() => {
    clearEditedItem()
  })
}

function addNewItem() {
  editedItem.value = {
    type: '',
    price: 0,
  }

  nextTick(() => {
    dialog.value = true
  })
}

function editPrice(type) {
  const item = modelValue.value.find((i) => i.type === type)
  if (!item) return

  editedItem.value = {
    ...item,
    withVat: Boolean(props.agreement.usePriceWithVAT),
    price: +(props.agreement.usePriceWithVAT ? item.price : item.priceWOVat).toFixed(2),
  }

  nextTick(() => {
    dialog.value = true
  })
}

function deletePrice(type) {
  const idx = modelValue.value.findIndex((i) => i.type === type)
  if (idx === -1) return
  const res = confirm('Вы уверены?')
  if (res) {
    const tmpArr = modelValue.value.slice()
    tmpArr.splice(idx, 1)
    modelValue.value = tmpArr
  }
}
</script>
