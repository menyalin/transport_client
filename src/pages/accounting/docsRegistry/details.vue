<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="showDeleteBtn"
  >
    <docs-registry-form
      :item="item"
      :disabledPickOrders="disabledPickOrders"
      :disabledMainFields="disabledMainFields"
      @cancel="cancel"
      @submit="submit"
      @save="submit($event, true)"
      @pickOrders="openDialog"
      @downloadPdf="downloadPdfHandler"
    />
    <docs-registry-orders-list
      :orders="item.orders"
      @delete="deleteOrderFromRegistry"
      @dblRowClick="dblRowClickHandler"
    />
    <v-dialog
      v-if="item._id"
      v-model="showPickOrderDialog"
      fullscreen
      persistent
      hide-overlay
    >
      <pick-orders
        :docsRegistry="item"
        :client="item.client"
        @cancel="closeDialog"
      />
    </v-dialog>
  </form-wrapper>
</template>

<script>
import dayjs from 'dayjs'
import { watch, ref, onBeforeUnmount, computed } from 'vue'
import socket from '@/socket'
import router from '@/router'
import store from '@/store'
import { DocsRegistryService } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { PdfMaker } from '@/shared/utils'
import {
  PickOrders,
  getDocsRegistryPdfDefinition,
} from '@/features/docsRegistry'
import {
  DocsRegistryForm,
  DocsRegistryOrdersList,
} from '@/entities/docsRegistry'

export default {
  name: 'DocsRegistryDetail',
  components: {
    FormWrapper,
    PickOrders,
    DocsRegistryForm,
    DocsRegistryOrdersList,
  },
  props: {
    id: String,
  },
  setup(props) {
    const item = ref({})
    const storedSettingsName = 'docsRegistry:showPickOrderDialog'
    const showPickOrderDialog = ref(
      store.getters.storedValue(storedSettingsName) || false
    )
    const disabledPickOrders = computed(() => {
      return !item.value?._id
    })

    const disabledMainFields = computed(() => {
      return item.value.orders?.length > 0
    })

    const showDeleteBtn = computed(() => {
      return (
        !!props?.id &&
        store.getters.hasPermission('docsRegistry:delete') &&
        item.value?.orders &&
        item.value?.orders.length === 0
      )
    })

    async function deleteOrderFromRegistry(orders) {
      if (!orders || orders.length === 0) return null
      await DocsRegistryService.removeOrdersFromRegistry({
        orders,
        docsRegistryId: item.value._id,
      })
    }

    function openDialog() {
      showPickOrderDialog.value = true
      store.commit('setStoredValue', { name: storedSettingsName, value: true })
    }

    function closeDialog() {
      showPickOrderDialog.value = false
      store.commit('setStoredValue', { name: storedSettingsName, value: false })
    }

    let loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        const res = await DocsRegistryService.getById(props.id)
        item.value = res
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }
    function downloadPdfHandler() {
      // Опись 001 от 2023 02 08 БИКОМ
      const fileNameStr = `Опись №${item.value.number} от ${dayjs(
        item.value.date
      ).format('YYYY-MM-DD')} : ${placeName.value}`
      PdfMaker.download(
        getDocsRegistryPdfDefinition(item.value, placeName.value),
        fileNameStr
      )
    }
    const placeName = computed(() => {
      const client = store.getters.partnersMap.get(item.value.client)
      if (!client || !client.placesForTransferDocs) return ''
      const place = client.placesForTransferDocs.find(
        (place) => place.address === item.value.placeForTransferDocs
      )
      return place?.title || '???'
    })

    const submit = async (formState, saveOnly) => {
      let updatedItem
      const itemId = props.id ? props.id : item.value?._id
      try {
        if (itemId) {
          updatedItem = await DocsRegistryService.updateOne(itemId, formState)
        } else {
          updatedItem = await DocsRegistryService.create(formState)
        }
        if (!saveOnly) router.push('/accounting/docsRegistry')
        else {
          item.value = updatedItem
        }
      } catch (e) {
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      }
    }

    async function deleteHandler() {
      try {
        if (props.id) {
          loading.value = true
          await DocsRegistryService.deleteById(props.id)
          router.push('/accounting/docsRegistry')
          loading.value = false
        } else return null
      } catch (e) {
        loading.value = false
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      }
    }

    watch(() => props.id, getItem, { immediate: true, deep: true })

    function dblRowClickHandler(orderId) {
      router.push('/orders/' + orderId)
    }

    function addOrders({ docsRegistry, orders }) {
      if (docsRegistry !== item.value._id) return null
      item.value.orders.push(...orders)
    }

    function removeOrders({ docsRegistry, orders }) {
      if (docsRegistry !== item.value._id) return null
      item.value.orders = item.value.orders.filter(
        (i) => !orders.includes(i.order._id)
      )
    }

    socket.on('orders:addedToRegistry', addOrders)
    socket.on('orders:removedFromRegistry', removeOrders)

    onBeforeUnmount(() => {
      socket.off('orders:removedFromRegistry', removeOrders)
      socket.off('orders:addedToRegistry', addOrders)
    })

    return {
      item,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      showPickOrderDialog,
      openDialog,
      closeDialog,
      deleteOrderFromRegistry,
      showDeleteBtn,
      dblRowClickHandler,
      disabledPickOrders,
      disabledMainFields,
      downloadPdfHandler,
    }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style></style>
