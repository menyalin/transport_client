<template>
  <v-card elevation="1" :loading="loading">
    <v-card-title>
      <h5>Транспортные накладные</h5>
    </v-card-title>
    <v-card-text>
      <TransportWaybillList
        :items="items"
        :getAddressNameById="getAddressNameById"
        :getPartnerNameByAddressId="getPartnerNameByAddressId"
        @edit="handlers.editItem"
        @remove="handlers.removeItem"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn icon @click="handlers.refreshList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn small color="primary" @click="handlers.openDialog">
        Добавить ТрН
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="formDialog" persistent width="1000px">
      <TransportWaybillForm
        :shipperAddressItems="shipperAddressItems"
        :consigneeAddressItems="consigneeAddressItems"
        :isVisible="formDialog"
        :item="editedItem"
        @cancel="handlers.cancel"
        @submit="handlers.submit"
      />
    </v-dialog>
  </v-card>
</template>
<script>
import { ref, watch } from 'vue'
import {
  TransportWaybillForm,
  TransportWaybillList,
  TransportWaybillService,
} from '@/entities/transport_waybill'
import { useOrderRouteData } from './useOrderRouteData'
import { useAddressStore } from '@/entities/address'
import { usePartnerStore } from '@/entities/partner'

export default {
  name: 'TransportWaybillsInOrderWidget',
  components: {
    TransportWaybillForm,
    TransportWaybillList,
  },
  props: {
    route: {
      type: Array,
      reqired: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
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
      return (
        partnerStore.getById(address.partner)?.name || 'partner name not found'
      )
    }

    const { shipperAddressItems, consigneeAddressItems } = useOrderRouteData(
      props,
      ctx
    )

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
        const updatedItem = await TransportWaybillService.update(
          editedItem.value._id,
          body
        )

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
    return {
      loading,
      formDialog,
      editedItem,
      items,
      shipperAddressItems,
      consigneeAddressItems,
      getAddressNameById,
      getPartnerNameByAddressId,
      handlers: {
        refreshList: refreshListHandler,
        openDialog: openDialogHandler,
        editItem: editItemHandler,
        removeItem: removeItemHandler,
        submit: submitHandler,
        cancel: cancelHandler,
      },
    }
  },
}
</script>
<style scoped></style>
