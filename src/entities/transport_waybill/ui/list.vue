<template>
  <v-data-table
    :items="preparedItems"
    :headers="headers"
    :items-per-page="-1"
    hide-default-footer
    @dblclick:row="dblClickRowHandler"
  >
    <template #[`item.actions`]="{ item }">
      <v-icon @click="removeItemHandler(item._id)" color="error"> mdi-delete </v-icon>
    </template>
    <template #[`item.download`]="{ item }">
      <v-icon @click="downloadHandler(item._id)" color="primary"> mdi-download </v-icon>
    </template>
  </v-data-table>
</template>
<script setup>
import { computed } from 'vue'

defineOptions({ name: 'TransportWaybillList' })

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  getAddressNameById: Function,
  getPartnerNameByAddressId: Function,
})

const emit = defineEmits(['edit', 'download', 'remove'])

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
  emit('edit', item._id)
}

function downloadHandler(itemId) {
  emit('download', itemId)
}

function removeItemHandler(itemId) {
  const res = confirm('Уверены?')
  if (res) emit('remove', itemId)
}
</script>
<style lang=""></style>
