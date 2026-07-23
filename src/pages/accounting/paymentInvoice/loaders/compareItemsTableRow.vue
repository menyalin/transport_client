<template>
  <tr v-if="!item.isOrderPicked">
    <td>{{ idx + 1 }}</td>
    <td>{{ item.clientNum }}</td>
    <td colspan="99" color="error">
      <b>Рейс не найден!</b>
    </td>
  </tr>
  <tr v-else @dblclick="rowDblClickHandler(item)">
    <td>{{ idx + 1 }}</td>
    <td>{{ item.clientNum }}</td>
    <td>{{ item.route }}</td>

    <td v-if="item.isDriverEqual">{{ item.driverNameInOrder }}</td>
    <td v-else class="has-diff">
      Рейс: {{ item.driverNameInOrder }} <br />
      Реестр: {{ item.uploadedDriverName }}
    </td>
    <!-- Гос.номер -->
    <td v-if="item.isTruckEqual">{{ item.truckInOrder }}</td>
    <td v-else class="has-diff">
      Рейс: {{ item.truckInOrder }} <br />
      Реестр: {{ item.uploadedTruckNumber }}
    </td>
    <!-- Тип ТС -->
    <td v-if="item.isTruckTypeEqual">{{ item.uploadedTruckType }}</td>
    <td v-else class="has-diff">
      Рейс: {{ item.pickedTruckTypeStr }}<br />
      Реестр: {{ item.uploadedTruckType }}
    </td>

    <!-- Цена без НДС -->
    <td v-if="item.isPriceEqual" class="text-right">
      {{ moneyFormatter(item.uploadedPrices.priceWOVat) }}
    </td>
    <td v-else class="has-diff text-right">
      Рейс: {{ moneyFormatter(item.pickedPrices.priceWOVat) }} <br />
      Реестр: {{ moneyFormatter(item.uploadedPrices.priceWOVat) }}
    </td>
  </tr>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { moneyFormatter } from '@/shared/utils/moneyFormatter'

defineOptions({ name: 'CompareItemsTableRow' })

defineProps({
  item: Object,
  idx: Number,
})

const router = useRouter()

function rowDblClickHandler(item) {
  router.push('/orders/' + item.orderId)
}
</script>

<style scoped>
.has-diff {
  background-color: rgba(255, 86, 86, 0.459);
  box-sizing: border-box;
  border-radius: 5px;
}
</style>
