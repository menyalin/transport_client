<template>
  <div>
    <v-alert v-if="errors.length > 0" type="error" outlined>
      Ошибка загрузки реестра: <br />
      <ul>
        <li v-for="error in errors" :key="error.message">{{ error }}</li>
      </ul>
    </v-alert>
    <v-alert v-else type="info" outlined>
      Загружено рейсов:
      <b>{{ items.length }}</b
      >, Общая сумма реестра:
      <b>{{ formattedSum }}</b>
    </v-alert>
  </div>
</template>
<script>
import { moneyFormatter } from '@/shared/utils'

export default {
  name: 'UploadedInformation',
  props: {
    items: Array,
    errors: Array,
  },
  computed: {
    ordersTotalSum() {
      if (this.items.length === 0) return 0
      return this.items.reduce((sum, item) => (sum += item.price), 0)
    },
    formattedSum() {
      return moneyFormatter(this.ordersTotalSum)
    },
  },
}
</script>
<style scoped></style>
