<template>
  <div class="user-info-wrapper ml-5 my-3">
    <div>
      <v-icon v-if="isBlockedUser" color="red"> mdi-account-cancel </v-icon>
      <v-icon v-else-if="isPending" color="blue"> mdi-account-clock </v-icon>
      <v-icon v-else-if="isAccepted" color="green"> mdi-account-check </v-icon>
      <v-icon v-else-if="isCanceled" color="grey"> mdi-account-cancel </v-icon>
    </div>
    <div class="text-h6">
      {{ worker.user.name }}
      <div class="text-subtitle-1">
        {{ worker.user.email }}
      </div>
    </div>
    <v-alert
      v-if="!isAccepted"
      :type="message.type"
      variant="outlined"
      class="ml-3"
    >
      {{ message.text }}
    </v-alert>
  </div>
</template>
<script>
import { computed } from 'vue'
export default {
  name: 'LinkedUserInfo',
  props: {
    worker: {
      type: Object,
    },
  },
  setup(props) {
    const isBlockedUser = computed(() => props.worker.disabled)
    const isPending = computed(
      () => props.worker.pending && props.worker.accepted
    )
    const isAccepted = computed(
      () => !props.worker.pending && props.worker.accepted
    )
    const isCanceled = computed(
      () => !props.worker.pending && !props.worker.accepted
    )
    const message = computed(() => {
      if (isBlockedUser.value)
        return {
          type: 'error',
          text: 'Пользователь заблокирован',
        }

      if (isCanceled.value)
        return {
          type: 'warning',
          text: 'Пользователь отклонил предложение',
        }

      if (isPending.value)
        return {
          type: 'info',
          text: 'Ожидается подтверждение пользователя',
        }
      return null
    })
    return {
      isBlockedUser,
      isPending,
      isAccepted,
      isCanceled,
      message,
    }
  },
}
</script>

<style scoped>
.user-info-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
