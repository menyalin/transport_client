<template>
  <div class="item-wrapper">
    <v-card outlined>
      <v-card-title>{{ value.title }}</v-card-title>
      <v-card-subtitle>{{ address.name }}</v-card-subtitle>
      <v-card-text>
        <h4>Разрешенные пункты погрузки:</h4>
        <ul>
          <li v-for="(point, idx) of allowedLoadingPoints" :key="idx">
            {{ point.shortName }}: {{ point.name }}
          </li>
        </ul>

        <h4 class="mt-4">Контакты:</h4>
        <div>{{ value.contacts }}</div>

        <h4 class="mt-4">Примечание:</h4>
        <div>{{ value.note }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn small color="secondary" @click="editHandler"
          >Редактировать</v-btn
        >
        <v-btn small color="error" @click="deleteHandler">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'PlaceTransferDocsItem',
  props: {
    value: Object,
  },
  setup(props, ctx) {
    const address = computed(() =>
      store.getters.addressMap.get(props.value.address)
    )
    const allowedLoadingPoints = computed(() =>
      props.value.allowedLoadingPoints.map((i) =>
        store.getters.addressMap.get(i)
      )
    )

    function deleteHandler() {
      ctx.emit('delete', props.value._id)
    }

    function editHandler() {
      ctx.emit('edit', props.value._id)
    }

    return {
      address,
      allowedLoadingPoints,
      deleteHandler,
      editHandler,
    }
  },
}
</script>
<style scoped>
.item-wrapper {
  max-width: 800px;
}
</style>
