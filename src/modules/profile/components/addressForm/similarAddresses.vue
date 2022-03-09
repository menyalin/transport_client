<template>
  <v-simple-table dense>
    <template>
      <caption class="text-left text-subtitle-2">
        Похожие адреса
      </caption>
      <thead>
        <tr>
          <th class="text-left">
            Название
          </th>
          <th class="text-left">
            Сокращенное название
          </th>
          <th class="text-left">
            Партнер
          </th>
          <th class="text-left">
            Метка
          </th>
          <th class="text-left">
            Примечание
          </th>
          <th class="text-left">
            Погрузка
          </th>
          <th class="text-left">
            Разгрузка
          </th>
          <th class="text-left">
            Действия
          </th>
          <th class="text-left">
            score
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in preparedAddresses"
          :key="item._id"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.shortName }}</td>
          <td>{{ item.partnerName }}</td>
          <td>{{ item.label }}</td>
          <td>{{ item.note }}</td>
          <td>
            <v-icon
              v-if="item.isShipmentPlace"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-minus
            </v-icon>
          </td>
          <td>
            <v-icon
              v-if="item.isDeliveryPlace"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-minus
            </v-icon>
          </td>
          <td>
            <router-link :to="'/profile/address/' + item._id">
              Перейти
            </router-link>
          </td>
          <td>{{ Math.round(item.score * 100) / 100 }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'SimilarAddresses',
  props: {
    addresses: {
      type: Array,
    },
  },
  computed: {
    preparedAddresses() {
      return this.addresses.map((a) => ({
        ...a,
        partnerName: this.$store.getters.partnersMap.get(a.partner)?.name,
      }))
    },
  },
}
</script>
<style></style>
