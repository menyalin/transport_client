<template>
  <div class="wrapper">
    <div class="btn-wrapper">
      <v-btn @click="goBack" small>Вернуться в акт</v-btn>
      <v-btn
        :disabled="!selected.length || loading"
        @click="addOrderHandler"
        color="primary"
        >Добавить в акт</v-btn
      >
    </div>
    <PickOrdersSettings v-model="settings" @refresh="refresh" />
    <v-data-table
      :items="items"
      :headers="headers"
      v-model="selected"
      dense
      item-key="_id"
      item-value="id"
      show-select
      checkbox-color="primary"
      @dblclick:row="dblClickRow"
      :style="{ width: '100%' }"
      :footer-props="{ 'items-per-page-options': [100, 200] }"
    >
      <template #[`item.docsStatus`]="{ item }">
        <DocStatusCell :status="item.docsStatus" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { usePickOrdersForIncomingInvoice } from './usePickOrders'
import PickOrdersSettings from './pickOrdersSettings.vue'
import DocStatusCell from './docStatusCell.vue'
export default {
  name: 'PickOrdersForIncomingInvoice',
  components: {
    PickOrdersSettings,
    DocStatusCell,
  },
  props: {
    invoiceId: String,
    agreementId: String,
    carrierId: String,
  },

  setup(props) {
    const { proxy } = getCurrentInstance()

    const {
      items,
      loading,
      refresh,
      headers,
      selected,
      selectedIds,
      settings,
      addOrderHandler,
    } = usePickOrdersForIncomingInvoice(props)
    function dblClickRow(_event, { item }) {
      proxy.$router.push({
        name: 'DetailsOrder',
        params: { id: item._id },
      })
    }
    function goBack() {
      proxy.$router.replace({
        name: 'IncomingInvoiceDetail',
        params: { id: props.invoiceId },
      })
    }

    return {
      settings,
      items,
      loading,
      refresh,
      goBack,
      headers,
      selected,
      selectedIds,
      dblClickRow,
      addOrderHandler,
    }
  },
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
