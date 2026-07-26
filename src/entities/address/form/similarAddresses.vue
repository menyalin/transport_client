<template>
  <v-table>
    <template>
      <caption class="text-left text-label-large">
        Похожие адреса
      </caption>
      <thead>
        <tr>
          <th class="text-left">Название</th>
          <th class="text-left">Сокращенное название</th>
          <th class="text-left">Партнер</th>
          <th class="text-left">Метка</th>
          <th class="text-left">Примечание</th>
          <th class="text-left">Погрузка</th>
          <th class="text-left">Разгрузка</th>
          <th class="text-left">Действия</th>
          <th class="text-left">score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in preparedAddresses" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ item.shortName }}</td>
          <td>{{ item.partnerName }}</td>
          <td>{{ item.label }}</td>
          <td>{{ item.note }}</td>
          <td>
            <v-icon v-if="item.isShipmentPlace" color="green"> mdi-check </v-icon>
            <v-icon v-else> mdi-minus </v-icon>
          </td>

          <td>
            <v-icon v-if="item.isDeliveryPlace" color="green"> mdi-check </v-icon>
            <v-icon v-else> mdi-minus </v-icon>
          </td>
          <td>
            <router-link :to="'/profile/address/' + item._id"> Перейти </router-link>
          </td>
          <td>{{ Math.round(item.score * 100) / 100 }}</td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'SimilarAddresses' })

const props = defineProps({
  addresses: {
    type: Array,
  },
})

const store = useStore()

const preparedAddresses = computed(() => {
  return props.addresses.map((a) => ({
    ...a,
    partnerName: store.getters.partnersMap.get(a.partner)?.name,
  }))
})
</script>
<style></style>
