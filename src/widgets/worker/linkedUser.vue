<template>
  <v-card
maxWidth="800px"
class="ma-3" :loading="loading" :disabled="loading"
>
    <v-card-title>Пользователь:</v-card-title>
    <v-card-text>
      <PickUser v-if="showPickUser" v-model="candidate" />
      <LinkedUserInfo v-if="showUserInfo" :worker="worker" />
      <StaffRolesSelect v-if="showRolesSelect" v-model="roles" :disabled="disableRolesSelect" />
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn v-if="showUpdateRolesBtn" :disabled="isRolesNotChanged" @click="updateRoles">Обновить роли</v-btn>
      <v-btn v-if="showSendInviteBtn" @click="sendInviteHandler">Пригласить</v-btn>
      <v-btn v-if="showResendInviteBtn" @click="resendInviteHandler">Пригласить повторно</v-btn>
      <v-btn v-if="showUserInfo" @click="toggleDisableStatus">
        {{ worker.disabled ? 'Разблокировать' : 'Заблокировать' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { LinkedUserInfo } from '@/entities/worker'
import { PickUser, StaffRolesSelect } from '@/features/worker'
import { useLinkedUserModel } from './useLinkedUserModel'

export default {
  name: 'LinkedUserWidget',
  components: {
    PickUser,
    StaffRolesSelect,
    LinkedUserInfo,
  },
  props: {
    worker: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const {
      disableRolesSelect,
      showPickUser,
      showRolesSelect,
      showUserInfo,
      showSendInviteBtn,
      showResendInviteBtn,
      resendInviteHandler,
      sendInviteHandler,
      candidate,
      roles,
      updateRoles,
      loading,
      showUpdateRolesBtn,
      isRolesNotChanged,
      toggleDisableStatus,
    } = useLinkedUserModel(props, ctx)

    return {
      disableRolesSelect,
      showPickUser,
      showRolesSelect,
      showUserInfo,
      showSendInviteBtn,
      sendInviteHandler,
      candidate,
      showResendInviteBtn,
      resendInviteHandler,
      roles,
      updateRoles,
      loading,
      showUpdateRolesBtn,
      isRolesNotChanged,
      toggleDisableStatus,
    }
  },
}
</script>
