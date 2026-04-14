<template>
  <v-data-table
    :items="preparedItems"
    :headers="headers"
    dense
    :itemsPerPage="-1"
    hide-default-footer
    @dblclick:row="dblClickRowHandler"
  >
    <template #[`item.actions`]="{ item }">
      <v-icon @click="removeItemHandler(item._id)" color="error">
        mdi-delete
      </v-icon>
    </template>
    <template #[`item.download`]="{ item }">
      <v-icon @click="downloadHandler(item._id)" color="primary">
        mdi-download
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { computed, getCurrentInstance } from 'vue'
export default {
  name: 'TransportWaybillList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    getAddressNameById: Function,
    getPartnerNameByAddressId: Function,
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance()
    const headers = [
      { value: 'download' },
      { value: 'number', text: 'Номер' },
      { value: 'date', text: 'Дата' },
      { value: 'shipperName', text: 'Грузоотправитель' },
      { value: 'shipperAddress', text: 'Погрузка' },
      { value: 'consigneeName', text: 'Грузополучатель' },
      { value: 'consigneeAddress', text: 'Разгрузка' },
      { value: 'docsDescription', text: 'Накладные' },
      { value: 'note', text: 'Примечание' },
      { value: 'actions', sortable: false },
    ]

    const preparedItems = computed(() => {
      return props.items.map((i) => ({
        ...i,
        date: new Date(i.date).toLocaleDateString(),
        shipperAddress: props.getAddressNameById(i.shipperAddressId),
        consigneeAddress: props.getAddressNameById(i.consigneeAddressId),
        shipperName: props.getPartnerNameByAddressId(i.shipperAddressId),
        consigneeName: props.getPartnerNameByAddressId(i.consigneeAddressId),
      }))
    })

    function dblClickRowHandler(_, { item }) {
      const invoiceId = item._id
      ctx.emit('edit', invoiceId)
    }
    function downloadHandler(itemId) {
      ctx.emit('download', itemId)
    }

    async function removeItemHandler(itemId) {
      const res = await proxy.$confirm('Уверены?')
      if (res) ctx.emit('remove', itemId)
    }

    return {
      dblClickRowHandler,
      downloadHandler,
      removeItemHandler,
      headers,
      preparedItems,
    }
  },
}
</script>
<style lang=""></style>
