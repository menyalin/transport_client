<template>
  <v-card elevation="1" :loading="loading">
    <v-card-title>
      <h5>Транспортные накладные</h5>
    </v-card-title>
    <v-card-text> тут будет список ТРН </v-card-text>
    <v-card-actions>
      <v-btn icon @click="handlers.refreshList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn small color="primary" @click="handlers.openDialog">
        Добавить ТрН
      </v-btn>
    </v-card-actions>
    {{ 'orderId: ' + orderId }}
  </v-card>
</template>
<script>
import { ref, watch } from 'vue'
import { TransportWaybillService } from '@/entities/transport_waybill'

export default {
  name: 'TransportWaybillsInOrderWidget',
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  setup(props, _ctx) {
    const loading = ref(false)
    const items = ref([])

    async function getItems() {
      try {
        loading.value = true
        const res = await TransportWaybillService.getByOrderId(props.orderId)
        console.log('getItems res: ', res)
        items.value = res
      } catch (e) {
        console.log('ошибка получения списка ТрН: ', e)
      } finally {
        loading.value = false
      }
    }

    function refreshListHandler() {}
    function openDialogHandler() {}

    watch(() => props.orderId, getItems, { immediate: true })
    return {
      loading,
      handlers: {
        refreshList: refreshListHandler,
        openDialog: openDialogHandler,
      },
    }
  },
}
</script>
<style scoped></style>
