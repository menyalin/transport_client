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
    <NotificationListFeature
      :partnerId="partner._id"
      :items="partner.idleTruckNotifications"
      @updatePartner="updatePartnerHandler"
      @editNotify="editNotifyHandler"
    />
    <v-dialog :value="dialog" persistent max-width="1200" :loading="loading">
      <IdleTruckNotifyForm
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
import { NotificationListFeature } from '@/features/partner'
import { useWidgetModel } from './model/model.js'
import { IdleTruckNotifyForm } from '@/entities/partner'
import { useAgreements } from '@/entities/agreement'

export default {
  name: 'IdleTruckNotificationsWidget',
  components: { NotificationListFeature, IdleTruckNotifyForm },
  props: {
    partner: Object,
  },
  setup(props, ctx) {
    function updatePartnerHandler(payload) {
      ctx.emit('updatePartner', payload)
    }
    const { allClientAgreements } = useAgreements()
    const agreemenstByClient = computed(() => {
      return allClientAgreements.value
        .filter((agreement) => agreement.clients.includes(props.partner._id))
        .map((i) => ({
          value: i._id,
          text: i.name,
        }))
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
      updatePartnerHandler,
      addNotificationHandler,
      cancelHandler,
      submitHandler,
      dialog,
      loading,
      editableItem,
      agreemenstByClient,
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
