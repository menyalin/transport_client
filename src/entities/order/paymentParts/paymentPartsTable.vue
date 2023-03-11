<template>
  <v-simple-table dense>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">Клиент</th>
          <th class="text-right">Сумма без НДС</th>
          <th class="text-right">Сумма НДС</th>
          <th class="text-right">Сумма с НДС</th>
          <th class="text-left">Примечание</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) of items"
          :key="idx"
          :class="{ 'not-accepted': item.status !== 'accepted' }"
        >
          <td>
            {{
              $store.getters.partnersMap.has(item.client)
                ? $store.getters.partnersMap.get(item.client).name
                : '????'
            }}
          </td>
          <td class="text-right" width="180px">
            {{ new Intl.NumberFormat().format(item.priceWOVat) }}
          </td>
          <td class="text-right" width="180px">
            {{ new Intl.NumberFormat().format(item.sumVat) }}
          </td>
          <td class="text-right" width="180px">
            {{ new Intl.NumberFormat().format(item.price) }}
          </td>
          <td>{{ item.note }}</td>
          <td class="text-right">
            <v-icon small :disabled="readonly" @click="deleteRow(idx)">
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'OrderPaymentPartsTable',
  props: {
    items: Array,
    readonly: Boolean,
  },
  setup(_props, { emit }) {
    function deleteRow(idx) {
      emit('deleteRow', idx)
    }
    return {
      deleteRow,
    }
  },
}
</script>
<style scoped></style>
