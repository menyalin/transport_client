<template>
  <div v-if="partner && partner._id" class="idle_truck_notifications_wrapper">
    <v-alert v-if="!partner._id" type="info">
      Добавление площадок возможно только после сохранения партнера
    </v-alert>
    <v-btn
      v-else
      small
      color="primary"
      :style="{ maxWidth: '200px' }"
      @click="addNotificationHandler"
    >
      Добавить оповещение
    </v-btn>
    <NotificationList
      :partnerId="partner._id"
      :items="partner.idleTruckNotifications"
      @editNotify="editNotifyHandler"
      @change="updateNotificationsHandler"
    />
    <v-dialog :value="dialog" persistent max-width="1200" :loading="loading">
      <IdleTruckNotificationForm
        :partnerId="partner._id"
        :loading="loading"
        :initialState="editableItem"
        @submit="submitHandler"
        @cancel="cancelHandler"
        :agreements="agreemenstByClient"
      />
    </v-dialog>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useWidgetModel } from './model.js'
import IdleTruckNotificationForm from './notificationForm/idleTruckNotificationForm'
import NotificationList from './notificationList/notificationList'

export default {
  name: 'IdleTruckNotifications',
  components: { NotificationList, IdleTruckNotificationForm },
  model: {
    props: 'items',
    event: 'change',
  },
  props: {
    partner: Object,
    clientAgreements: Array,
  },
  setup(props, ctx) {
    const updateNotificationsHandler = (items) => {
      ctx.emit('change', items)
    }
    const agreemenstByClient = computed(() => {
      const res = props.clientAgreements
        ?.filter((agreement) => agreement.clients.includes(props.partner?._id))
        .map((i) => ({
          value: i._id,
          text: i.name,
        }))

      return res || []
    })

    const {
      editNotifyHandler,
      addNotificationHandler,
      cancelHandler,
      submitHandler,
      dialog,
      loading,
      editableItem,
    } = useWidgetModel(props, ctx)
    return {
      editNotifyHandler,
      addNotificationHandler,
      cancelHandler,
      submitHandler,
      dialog,
      loading,
      editableItem,
      agreemenstByClient,
      updateNotificationsHandler,
    }
  },
}
</script>

<style scoped>
.idle_truck_notifications_wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
</style>
