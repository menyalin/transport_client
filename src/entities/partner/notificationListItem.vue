<template>
  <v-card outlined min-width="600px" max-width="800px" class="ma-3" fill-height>
    <v-card-title> {{ item.title }}</v-card-title>
    <v-card-text>
      <div>
        Адреса клиента: <b>{{ addresses }}</b>
      </div>
      <div>
        Основные получатели уведомлений: <b>{{ item.emails }}</b>
      </div>
      <div v-if="!!item.ccEmails">
        Получатели копии уведомлений: <b>{{ item.ccEmails }}</b>
      </div>
      <div>
        Часов до отправки уведомления: <b>{{ item.idleHoursBeforeNotify }}</b>
        используется плановая дата доставки:
        <b> {{ item.usePlannedDate ? 'Да' : 'Нет' }}</b>
      </div>
      <div v-if="item.note">
        <i>{{ item.note }}</i>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="secondary" @click="editHandler">Редактировать</v-btn>
      <v-btn small color="error" @click="deleteHandler">Удалить</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import store from '@/store/index'
import { computed } from 'vue'
export default {
  name: 'NotificationListItem',
  props: {
    item: Object,
  },
  setup(props, ctx) {
    const addresses = computed(() => {
      return store.getters.addresses
        .filter((address) => props.item.addresses.includes(address._id))
        .map((i) => i.shortName)
        .join('; ')
    })

    function editHandler() {
      ctx.emit('edit', props.item._id)
    }

    function deleteHandler() {
      ctx.emit('delete', props.item._id)
    }

    return {
      editHandler,
      deleteHandler,
      addresses,
    }
  },
}
</script>
<style scoped>
.as {
  justify-self: end;
}
</style>
