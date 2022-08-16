<template>
  <div class="user-info-wrapper pl-3 mt-3">
    <div v-if="worker">
      <v-icon 
        v-if="isBlockedUser" 
        color="red"
      >
        mdi-account-cancel
      </v-icon>
      <v-icon
        v-else-if="isPending"
        color="blue"
      >
        mdi-account-clock
      </v-icon>
      <v-icon
        v-else-if="isAccepted"
        color="green"
      >
        mdi-account-check
      </v-icon>
      <v-icon
        v-else-if="isCanceled"
        color="grey"
      >
        mdi-account-cancel
      </v-icon>
    </div>
    <div class="text-h6">
      {{ user.name }}
      <div class="text-subtitle-1">
        {{ user.email }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserInfo',
  props: {
    user: Object,
    worker: Object,
  },
  computed: {
    isBlockedUser() {
      if (!this.worker) return false
      return this.worker.disabled
    },
    isPending() {
      if (!this.worker) return false
      return this.worker.pending && this.worker.accepted
    },
    isAccepted() {
      if (!this.worker) return false
      return !this.worker.pending && this.worker.accepted
    },
    isCanceled() {
      if (!this.worker) return false
      return !this.worker.pending && !this.worker.accepted
    }

  }

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