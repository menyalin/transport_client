<template>
  <div class="wrapper">
    <div class="btn-wrapper">
      <v-btn @click="goBack" size="small">Вернуться в акт</v-btn>
      <v-btn :disabled="!selected.length || loading" @click="addOrderHandler" color="primary">
        Добавить в акт
      </v-btn>
    </div>
    <PickOrdersSettings v-model="settings" @refresh="refresh" />
    <v-data-table
      :items="items"
      :headers="headers"
      v-model="selected"
      item-value="_id"
      show-select
      checkbox-color="primary"
      @dblclick:row="dblClickRow"
      :style="{ width: '100%' }"
      :items-per-page-options="[100, 200]"
    >
      <template #[`item.docsStatus`]="{ item }">
        <DocStatusCell :status="item.docsStatus" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePickOrdersForIncomingInvoice } from './usePickOrders'
import PickOrdersSettings from './pickOrdersSettings.vue'
import DocStatusCell from './docStatusCell.vue'

defineOptions({ name: 'PickOrdersForIncomingInvoice' })

const props = defineProps({
  invoiceId: String,
  agreementId: String,
  carrierId: String,
})

const router = useRouter()

const { items, loading, refresh, headers, selected, settings, addOrderHandler } =
  usePickOrdersForIncomingInvoice(props)

function dblClickRow(_event, { item }) {
  router.push({
    name: 'DetailsOrder',
    params: { id: item._id },
  })
}

function goBack() {
  router.replace({
    name: 'IncomingInvoiceDetail',
    params: { id: props.invoiceId },
  })
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
