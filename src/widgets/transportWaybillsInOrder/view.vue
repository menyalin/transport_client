<template>
  <div>
    <CardSection title="Транспортные накладные" :loading="loading">
      <TransportWaybillList
        :items="items"
        :getAddressNameById="getAddressNameById"
        :getPartnerNameByAddressId="getPartnerNameByAddressId"
        @download="downloadHandler"
        @edit="editItemHandler"
        @remove="removeItemHandler"
      />
      <template #actions>
        <v-btn icon @click="refreshListHandler">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn size="small" color="primary" @click="openDialogHandler"> Добавить ТрН </v-btn>
      </template>
    </CardSection>

    <v-dialog v-model="formDialog" persistent width="1000px">
      <TransportWaybillForm
        :shipperAddressItems="shipperAddressItems"
        :consigneeAddressItems="consigneeAddressItems"
        :isVisible="formDialog"
        :item="editedItem"
        @cancel="cancelHandler"
        @submit="submitHandler"
      />
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { CardSection } from '@/shared/ui'
import { TransportWaybillForm } from '@/features/transportWaybill'
import { TransportWaybillList, TransportWaybillService } from '@/entities/transport_waybill'
import { useOrderRouteData } from './useOrderRouteData'
import { useAddressStore } from '@/entities/address'
import { usePartnerStore } from '@/entities/partner'

defineOptions({ name: 'TransportWaybillsInOrderWidget' })

const props = defineProps({
  route: {
    type: Array,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
})

const store = useStore()

const loading = ref(false)
const items = ref([])
const formDialog = ref(false)
const editedItem = ref(null)

const addressStore = useAddressStore()
const partnerStore = usePartnerStore()

function getAddressNameById(id) {
  return addressStore.getById(id)?.name ?? 'address name not found'
}

function getPartnerNameByAddressId(addressId) {
  const address = addressStore.getById(addressId)
  if (!address) return 'address not found'
  return partnerStore.getById(address.partner)?.name || 'partner name not found'
}

const { shipperAddressItems, consigneeAddressItems } = useOrderRouteData(props)

function editItemHandler(itemId) {
  const idx = items.value.findIndex((i) => i._id === itemId)
  if (idx === -1) return
  editedItem.value = items.value[idx]
  openDialogHandler()
}

async function getItems() {
  try {
    loading.value = true
    const res = await TransportWaybillService.getByOrderId(props.orderId)
    items.value = res
  } catch (e) {
    console.log('ошибка получения списка ТрН: ', e)
  } finally {
    loading.value = false
  }
}

async function downloadHandler(itemId) {
  try {
    loading.value = true
    await TransportWaybillService.downloadDoc(itemId, {
      templateName: 'common_transport_waybill',
    })
  } catch (e) {
    const { message } = JSON.parse(await e.response.data.text())
    store.commit('setError', message || e?.message || e)
  } finally {
    loading.value = false
  }
}

async function refreshListHandler() {
  await getItems()
}

function openDialogHandler() {
  formDialog.value = true
}

function cancelHandler() {
  formDialog.value = false
  editedItem.value = null
}

async function submitHandler(formState) {
  const body = {
    ...formState,
    orderId: props.orderId,
  }
  if (editedItem.value) {
    const updatedItem = await TransportWaybillService.update(editedItem.value._id, body)
    const idx = items.value.findIndex((i) => i._id === editedItem.value._id)
    items.value.splice(idx, 1, updatedItem)
  } else {
    const newWaybill = await TransportWaybillService.create(body)
    items.value.push(newWaybill)
  }
  cancelHandler()
}

async function removeItemHandler(id) {
  try {
    loading.value = true
    await TransportWaybillService.deleteById(id)
    items.value = items.value.filter((i) => i._id !== id)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

watch(() => props.orderId, getItems, { immediate: true })
</script>
<style scoped></style>
