<template>
  <div v-if="partner && partner._id" class="idle_truck_notifications_wrapper">
    <v-alert v-if="!partner._id" type="info">
      Добавление площадок возможно только после сохранения партнера
    </v-alert>
    <v-btn
      v-else
      size="small"
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
    <v-dialog :model-value="dialog" persistent max-width="1200" :loading="loading">
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

<script setup>
import { computed } from 'vue'
import { useWidgetModel } from './model.js'
import IdleTruckNotificationForm from './notificationForm/idleTruckNotificationForm'
import NotificationList from './notificationList/notificationList'

defineOptions({ name: 'IdleTruckNotifications' })

const idleTruckNotifications = defineModel({ type: Array, default: () => [] })

const props = defineProps({
  partner: Object,
  clientAgreements: Array,
})

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
} = useWidgetModel(props, idleTruckNotifications)

function updateNotificationsHandler(items) {
  idleTruckNotifications.value = items
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
