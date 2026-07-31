<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="state-block">
      <div>
        <v-radio-group v-model="model.status" :readonly="readonly">
          <v-radio
            v-for="status of orderStatuses"
            :key="status.value"
            :disabled="disabledStatus(status.value)"
            :label="status.text"
            :value="status.value"
          />
        </v-radio-group>
      </div>
      <div>
        <v-checkbox
          v-model="model.driverNotified"
          :readonly="readonly"
          label="Водитель оповещен"
          :disabled="!enableConfirm || disabledNotification"
          hide-details
          density="compact"
        />
        <v-checkbox
          v-model="model.clientNotified"
          label="Клиент оповещен"
          :readonly="readonly"
          :disabled="!enableConfirm || disabledNotification"
          hide-details
          density="compact"
        />
        <v-checkbox
          v-model="model.warning"
          label="На контроле"
          :readonly="readonly"
          hide-details
          density="compact"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BlockTitle } from '@/shared/ui'
import { useOrderStore } from '@/entities/order/orderStore'

defineOptions({ name: 'RouteState' })

enum STATUSES {
  NEED_GET = 'needGet',
  GETTED = 'getted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  WE_REFUSED = 'weRefused',
  CLIENT_REFUSED = 'clientRefused',
  NOT_CONFIRMED_BY_CLIENT = 'notСonfirmedByClient',
}

interface OrderState {
  status: STATUSES
  warning: boolean
  driverNotified: boolean
  clientNotified: boolean
}

const model = defineModel<OrderState>('model-value', {
  default: () => ({
    status: STATUSES.NEED_GET,
    warning: false,
    driverNotified: false,
    clientNotified: false,
  }),
})

const props = defineProps<{
  title?: string
  enableConfirm?: boolean
  routeCompleted?: boolean
  enableRefuse?: boolean
  isExistFirstArrivalDate?: boolean
  isValidGrade?: boolean
  readonly?: boolean
}>()

const orderStore = useOrderStore()

const orderStatuses = computed(() => orderStore.orderStatuses)

function getAllowedStatuses(): STATUSES[] {
  const { status, driverNotified, clientNotified } = model.value
  const { enableRefuse, routeCompleted, isExistFirstArrivalDate, isValidGrade } = props

  // needGet
  if (status === STATUSES.NEED_GET) {
    return enableRefuse
      ? [STATUSES.NEED_GET, STATUSES.GETTED, STATUSES.NOT_CONFIRMED_BY_CLIENT, STATUSES.WE_REFUSED]
      : [STATUSES.NEED_GET, STATUSES.GETTED]
  }

  // getted
  if (status === STATUSES.GETTED) {
    if (!driverNotified && !clientNotified) {
      return enableRefuse
        ? [STATUSES.NEED_GET, STATUSES.GETTED, STATUSES.WE_REFUSED, STATUSES.CLIENT_REFUSED]
        : [STATUSES.NEED_GET, STATUSES.GETTED]
    }
    if (driverNotified && clientNotified) {
      return [STATUSES.GETTED, STATUSES.IN_PROGRESS]
    }
    return enableRefuse
      ? [STATUSES.NEED_GET, STATUSES.GETTED, STATUSES.WE_REFUSED, STATUSES.CLIENT_REFUSED]
      : [STATUSES.NEED_GET, STATUSES.GETTED]
  }

  // inProgress
  if (status === STATUSES.IN_PROGRESS) {
    if (!routeCompleted && !isExistFirstArrivalDate) {
      return [STATUSES.IN_PROGRESS, STATUSES.GETTED]
    }
    if (!routeCompleted && isExistFirstArrivalDate) {
      return [STATUSES.IN_PROGRESS]
    }
    if (routeCompleted && !isValidGrade) {
      return [STATUSES.IN_PROGRESS]
    }
    if (routeCompleted && isValidGrade) {
      return [STATUSES.IN_PROGRESS, STATUSES.COMPLETED]
    }
  }

  // completed
  if (status === STATUSES.COMPLETED) {
    return [STATUSES.COMPLETED, STATUSES.IN_PROGRESS]
  }

  // weRefused
  if (status === STATUSES.WE_REFUSED) {
    return [STATUSES.GETTED, STATUSES.WE_REFUSED]
  }

  // clientRefused
  if (status === STATUSES.CLIENT_REFUSED) {
    return [STATUSES.GETTED, STATUSES.CLIENT_REFUSED]
  }

  // notСonfirmedByClient
  if (status === STATUSES.NOT_CONFIRMED_BY_CLIENT) {
    return [STATUSES.NEED_GET, STATUSES.GETTED, STATUSES.NOT_CONFIRMED_BY_CLIENT]
  }

  return []
}

const disabledNotification = computed(() => [STATUSES.NEED_GET].includes(model.value.status))

function disabledStatus(statusValue: string): boolean {
  const allowed = getAllowedStatuses()
  return !allowed.includes(statusValue as STATUSES)
}
</script>

<style scoped>
.state-block {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 270px;
}
</style>
