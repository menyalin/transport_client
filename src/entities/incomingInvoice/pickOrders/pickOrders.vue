<template>
  <div class="wrapper">
    <div class="btn-wrapper">
      <v-btn size="small" @click="goBack">Вернуться в акт</v-btn>
      <v-btn :disabled="!selected.length || loading" color="primary" @click="addOrderHandler">Добавить в акт</v-btn>
    </div>
    <PickOrdersSettings v-model="settings" @refresh="refresh" />
    <v-data-table
      v-model="selected"
      :items="items"
      :headers="headers"
     
      itemKey="_id"
      itemValue="id"
      showSelect
      checkboxColor="primary"
      :style="{ width: '100%' }"
      :footerProps="{ 'items-per-page-options': [100, 200] }"
      @dblclick:row="dblClickRow"
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

    const { items, loading, refresh, headers, selected, selectedIds, settings, addOrderHandler } =
      usePickOrdersForIncomingInvoice(props)
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
