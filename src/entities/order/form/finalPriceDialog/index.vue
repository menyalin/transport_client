<template>
  <v-dialog :model-value="dialog" max-width="800" @update:model-value="inputDialog">
    <v-card>
      <v-card-title>
        <div class="text-h6">Итоговые цены рейса</div>

        <v-spacer />
        <v-switch v-model="priceWithVat" class="mt-0 pt-0" label="Цены с НДС" hide-details />
      </v-card-title>

      <v-card-text>
        <app-final-price-table
          v-if="agreement"
          :prePrices="prePrices"
          :prices="order.prices"
          :priceWithVat="priceWithVat"
          :finalPrices="finalPrices"
          :agreementVatRate="vatRateInfo?.vatRate"
          :readonly="readonly"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel"> Отмена </v-btn>
        <v-btn
          color="primary"
          :disabled="saveBtnDisabled || !isChangedFinalPrices || readonly"
          :loading="loading"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { OrderService } from '@/shared/services'
import appFinalPriceTable from './finalPriceTable.vue'

defineOptions({ name: 'PriceDialog' })

const props = defineProps({
  order: Object,
  dialog: Boolean,
  finalPrices: Array,
  prePrices: Array,
  agreement: Object,
  readonly: Boolean,
  vatRateInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:dialog'])

const store = useStore()

const loading = ref(false)
const priceWithVat = ref(false)

const orderPriceTypes = computed(() => store.getters.orderPriceTypes)

const saveBtnDisabled = computed(
  () => loading.value || !store.getters.hasPermission('order:writeFinalPrices')
)

const isChangedFinalPrices = computed(() => {
  if (!Array.isArray(props.finalPrices) || props.finalPrices.length === 0) return false
  if (!Array.isArray(props.order.finalPrices) && props.finalPrices.length > 0) return true
  const orderFinalPricesMap = new Map(props.order.finalPrices.map((p) => [p.type, p.price]))
  const finalPricesMap = new Map(props.finalPrices.map((p) => [p.type, p.price]))
  return orderPriceTypes.value.some(
    ({ value }) => orderFinalPricesMap.get(value) !== finalPricesMap.get(value)
  )
})

watch(
  () => props.agreement,
  (val) => {
    priceWithVat.value = val?.usePriceWithVAT || false
  },
  { immediate: true, deep: true }
)

function inputDialog(val) {
  if (!val) cancel()
}

function cancel() {
  emit('update:dialog', false)
}

async function save() {
  try {
    loading.value = true
    await OrderService.updateFinalPrices({
      orderId: props.order._id,
      company: store.getters.directoriesProfile,
      finalPrices: props.finalPrices,
    })
    loading.value = false
    emit('update:dialog', false)
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}
</script>
