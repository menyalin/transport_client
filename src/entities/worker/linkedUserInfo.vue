<template>
  <div class="user-info-wrapper ml-5 my-3">
    <div>
      <v-icon v-if="isBlockedUser" color="red" icon="mdi-account-cancel" />
      <v-icon v-else-if="isPending" color="blue" icon="mdi-account-clock" />
      <v-icon v-else-if="isAccepted" color="green" icon="mdi-account-check" />
      <v-icon v-else-if="isCanceled" color="grey" icon="mdi-account-cancel" />
    </div>
    <div class="text-headline-small">
      {{ worker.user.name }}
      <div class="text-body-large">
        {{ worker.user.email }}
      </div>
    </div>
    <v-alert v-if="!isAccepted" :type="message.type" class="ml-3">
      {{ message.text }}
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'LinkedUserInfo' })

const props = defineProps({
  worker: {
    type: Object,
  },
})

const isBlockedUser = computed(() => props.worker.disabled)
const isPending = computed(() => props.worker.pending && props.worker.accepted)
const isAccepted = computed(() => !props.worker.pending && props.worker.accepted)
const isCanceled = computed(() => !props.worker.pending && !props.worker.accepted)

const message = computed(() => {
  if (isBlockedUser.value) return { type: 'error', text: 'Пользователь заблокирован' }
  if (isCanceled.value) return { type: 'warning', text: 'Пользователь отклонил предложение' }
  if (isPending.value) return { type: 'info', text: 'Ожидается подтверждение пользователя' }
  return { type: '', text: '' }
})
</script>

<style scoped>
.user-info-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
