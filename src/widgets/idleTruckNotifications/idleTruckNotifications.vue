<template>
  <div class="idle_truck_notifications_wrapper">
    <h5 class="ml-3">Настройка оповещений при простое транспорта</h5>
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
    <NotificationListFeature :items="partner.idleTruckNotifications" />
    <v-dialog :value="dialog" persistent max-width="1200" :loading="loading">
      <IdleTruckNotifyForm
        :partnerId="partner._id"
        :loading="loading"
        @submit="submitHandler"
        @cancel="cancelHandler"
      />
    </v-dialog>
  </div>
</template>

<script>
import { NotificationListFeature } from '@/features/partner'
import { useWidgetModel } from './model/model.js'
import { IdleTruckNotifyForm } from '@/entities/partner'

export default {
  name: 'IdleTruckNotificationsWidget',
  components: { NotificationListFeature, IdleTruckNotifyForm },
  props: {
    partner: Object,
  },
  setup(props, ctx) {
    const {
      addNotificationHandler,
      cancelHandler,
      submitHandler,
      dialog,
      loading,
    } = useWidgetModel(props, ctx)
    return {
      addNotificationHandler,
      cancelHandler,
      submitHandler,
      dialog,
      loading,
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
