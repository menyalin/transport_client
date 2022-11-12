<template>
  <div class="client-block-wrapper">
    <div class="block-header">
      <span class="text-h6">
        {{ clientName }}
      </span>
      рейсов: <b>{{ totalCount }}</b>, Сумма:
      <b>{{ Intl.NumberFormat().format(Math.round(totalWithVat / 1000)) }}</b>
      тыс.руб
    </div>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">№</th>
            <th class="text-left">Клиент</th>
            <th class="text-left">ТС</th>
            <th class="text-left">Водитель</th>
            <th class="text-left">ТК</th>
            <th class="text-left">Погрузка</th>
            <th class="text-left">Выгрузка</th>
            <th class="text-right">Стоимость с НДС</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in orders"
            :key="item._id"
            @dblclick="dblClickHandler(item._id)"
          >
            <td>{{ idx + 1 }}</td>
            <td>{{ clientName }}</td>
            <td>
              {{
                $store.getters.trucksMap.has(item.truckId)
                  ? $store.getters.trucksMap.get(item.truckId).regNum
                  : null
              }}
            </td>
            <td>
              {{
                item.driverId && $store.getters.driversMap.has(item.driverId)
                  ? $store.getters.driversMap.get(item.driverId).fullName
                  : null
              }}
            </td>
            <td>
              {{
                item.driverId && $store.getters.driversMap.has(item.driverId)
                  ? $store.getters.driversMap.get(item.driverId).tkName.name
                  : null
              }}
            </td>
            <td>
              {{
                item.loadingAddressIds
                  .map((i) => $store.getters.addressMap.get(i).shortName)
                  .join(', ')
              }}
            </td>
            <td>
              {{
                item.unloadingAddressIds
                  .map((i) => $store.getters.addressMap.get(i).shortName)
                  .join(', ')
              }}
            </td>
            <td class="text-right">
              {{
                Intl.NumberFormat().format(Math.round(item.totalWithVat / 1000))
              }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider class="mb-4" />
  </div>
</template>
<script>
export default {
  name: 'ClientBlock',
  props: {
    clientId: { type: String, required: true },
    orders: { type: Array },
    totalCount: { type: Number, required: true },
    totalWOVat: { type: Number, required: true },
    totalWithVat: { type: Number, required: true },
  },
  computed: {
    clientName() {
      return (
        this.$store.getters.partnersMap.get(this.clientId)?.name ||
        'bad_client_id'
      )
    },
  },
  methods: {
    dblClickHandler(orderId) {
      this.$router.push(`/orders/${orderId}`)
    },
  },
}
</script>
<style scoped>
.client-block-wrapper {
  width: 100%;
}
</style>
