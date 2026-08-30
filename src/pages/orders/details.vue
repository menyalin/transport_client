<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error">
          {{ error.message }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <OrderForm
          v-else
          :order="item"
          :displayDeleteBtn="showDeleteBtn"
          :loading="loading"
          :carrierItemsMap="carrierStore.carriersMap"
          :getCarrierAgreementById="carrierAgreementStore.getById"
          @cancel="cancel"
          @submit="submit($event)"
          @save="submit($event, true)"
          @delete="deleteHandler"
          @need-create-address="onNeedCreateAddress"
          @need-edit-address="onNeedEditAddress"
        >
          <template v-slot:transport_waybills v-if="isVisibleTransportWaybillsWidget">
            <TransportWaybillsInOrderWidget :orderId="item._id" :route="item.route" />
          </template>
        </OrderForm>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import socket from '@/socket'
import { OrderService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'
import { OrderForm } from '@/features/order'
import { useOrderValidations } from '@/entities/order'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { useCarrierAgreementStore } from '@/entities/carrierAgreement'
import { TransportWaybillsInOrderWidget } from '@/widgets/transportWaybillsInOrder'
import { pushContext } from '@/shared/composables/useReturnContext'

defineOptions({ name: 'DetailsOrder' })

const props = defineProps({
  id: String,
  truckId: String,
  startDate: String,
})

const router = useRouter()
const route = useRoute()
const store = useStore()

const carrierAgreementStore = useCarrierAgreementStore()
const carrierStore = useCarrierStore()
const { beforeSubmitOrderValidation } = useOrderValidations()

const item = ref(null)
const loading = ref(false)
const tmpVal = ref(null)
const error = ref({ message: null, show: false })

const isVisibleTransportWaybillsWidget = computed(() => Boolean(props.id))

const showDeleteBtn = computed(() => {
  return (
    !!props.id &&
    store.getters.hasPermission('order:delete') &&
    item.value?.state?.status === 'needGet'
  )
})

watch(
  () => props.id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loading.value = true
      item.value = await OrderService.getById(newVal)
      loading.value = false
    }
  },
  { immediate: true }
)

function onFinalPriceUpdated({ finalPrices }) {
  item.value = Object.assign({}, item.value, { finalPrices })
}

watch(
  () => props.id,
  (newVal, _oldVal, onCleanup) => {
    if (newVal) {
      socket.on(`order:${newVal}:finalPriceUpdated`, onFinalPriceUpdated)
      onCleanup(() => socket.off(`order:${newVal}:finalPriceUpdated`, onFinalPriceUpdated))
    }
  },
  { immediate: true }
)

if (props.startDate) {
  item.value = {
    startPositionDate: props.startDate,
    confirmedCrew: {
      truck: props.truckId,
    },
    route: [
      {
        type: 'loading',
        plannedDate: new Date(props.startDate).toISOString(),
      },
      { type: 'unloading' },
    ],
  }
}

applyReturnAddress()

async function submit(val, saveOnly) {
  const [isInvalid, errorMessage] = beforeSubmitOrderValidation(val)
  if (isInvalid) {
    error.value = { message: errorMessage, show: true }
    return
  }

  tmpVal.value = val
  const isCreate = !props.id
  let res
  try {
    loading.value = true
    if (isCreate) {
      res = await OrderService.create(val)
      item.value = res
      if (saveOnly) {
        router.replace({
          name: 'DetailsOrder',
          params: { id: res._id },
        })
      } else {
        router.go(-1)
      }
    } else {
      res = await OrderService.updateOne(props.id, val)
      item.value = Object.assign(item.value, res)
    }
    tmpVal.value = null
    if (!isCreate && !saveOnly) router.go(-1)
  } catch (e) {
    item.value = tmpVal.value
    if (e.response?.status === 400 || e.response?.status === 403) {
      error.value = { message: e.response?.data, show: true }
    } else store.commit('setError', e)
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.go(-1)
}

function onNeedCreateAddress(pointIndex) {
  const ctxId = pushContext(route.path, 'pick-address', { pointIndex, action: 'select' })
  router.push({ name: 'AddressCreate', query: { ctx: ctxId } })
}

function onNeedEditAddress(addressId, pointIndex) {
  const ctxId = pushContext(route.path, 'edit-address', {
    pointIndex,
    action: 'select',
    id: addressId,
  })
  router.push({
    name: 'AddressDetails',
    params: { id: addressId },
    query: { ctx: ctxId },
  })
}

function applyReturnAddress() {
  const { newAddressId, pointIndex } = route.query
  if (newAddressId === undefined || pointIndex === undefined) return
  const index = Number(pointIndex)
  if (!item.value || !item.value.route || !item.value.route[index]) return
  item.value.route[index].address = newAddressId
  const query = { ...route.query }
  ;['newAddressId', 'pointIndex', 'action'].forEach((k) => delete query[k])
  router.replace({ query })
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    try {
      loading.value = true
      await OrderService.deleteById(props.id)
      loading.value = false
      router.go(-1)
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }
}
</script>
<style></style>
