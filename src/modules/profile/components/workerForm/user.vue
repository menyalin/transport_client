<template>
  <v-card
    class="ma-3 mb-6"
    max-width="800px"
  >
    <v-card-title> Пользователь: </v-card-title>
    <v-card-text>
      <v-text-field
        v-if="!userId && $store.getters.hasPermission('worker:userAdmin')"
        v-model="emailSearch"
        clearable
        label="Найти пользователя по email"
        @change="searchUser"
      />
      <div v-if="isLoading">
        ...loading: {{ isLoading }}
      </div>
      <div v-else-if="userId && user">
        <app-user-info
          :user="user"
          :worker="worker"
        />
        <v-select
          :value="worker.roles"
          class="mt-8"
          :items="$store.getters.staffRoles"
          multiple
          :readonly="readonlyRoles"
          label="Роли пользователя"
          outlined
          @change="changeRoles"
        />
        <v-alert
          v-if="worker && worker.pending && worker.accepted && !worker.disabled"
          type="info"
          outlined
        >
          Приглашение отправлено, но пользователь еще не подтвердил приглашение
        </v-alert>

        <v-alert
          v-if="worker && worker.disabled"
          type="error"
          outlined
        >
          Доступ для пользователя закрыт!
        </v-alert>
        <v-alert
          v-if="worker && !worker.accepted && !worker.pending"
          outlined
          color="grey"
        >
          Пользователь отклонил приглашение
        </v-alert>
        <div 
          v-if="worker" 
          class="buttons-row"
        >
          <v-btn
            v-if="$store.getters.hasPermission('worker:userAdmin')"
            :disabled="
              tmpRoles.length === 0 || (!worker.accepted && !worker.pending)
            "
            @click="updateRoles"
          >
            Обновить роли
          </v-btn>
          <v-btn
            v-if="
              worker.accepted &&
                $store.getters.hasPermission('worker:userAdmin')
            "
            @click="toggleDisableStatus"
          >
            {{ worker.disabled ? 'Открыть доступ' : 'заблокировать доступ' }}
          </v-btn>
          <v-btn
            v-if="!worker.accepted && !worker.pending"
            @click="resendInvite"
          >
            пригласить еще раз
          </v-btn>
        </div>
      </div>

      <div v-else-if="tmpUser">
        <v-divider />
        <app-user-info :user="tmpUser" />
        <v-select
          v-model="tmpRoles"
          class="mt-8"
          :items="$store.getters.staffRoles"
          multiple
          label="Укажите роли пользователя"
          outlined
          :disabled="isInviteSended"
        />
        <v-btn
          v-if="!isInviteSended"
          small
          text
          class="my-4"
          color="primary"
          :disabled="tmpRoles.length === 0"
          @click="
            sendInvite({ userId: tmpUser._id, workerId, roles: tmpRoles })
          "
        >
          Пригласить
        </v-btn>
        <v-alert
          v-if="isInviteSended"
          type="info"
        >
          Приглашение отправлено
        </v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import store from '@/store'
import AppUserInfo from './_userInfo.vue'
import workerService from '../../services/worker.service'
import userService from '../../../auth/services/user.service'
import { computed, ref } from 'vue'

export default {
  name: 'User',
  components: {
    AppUserInfo,
  },
  props: {
    workerId: { type: String, required: true },
    userId: String,
  },

  data() {
    return {
      tmpRoles: [],
      emailSearch: null,
    }
  },
  computed: {
    readonlyRoles() {
      return !this.$store.getters.hasPermission('worker:userAdmin')
    },
  },

  setup({ userId, workerId }) {
    let tmpUser = ref()
    let user = ref()
    let worker = ref()
    let isUserLoading = ref(false)
    let isWorkerLoading = ref(false)
    
    const getUserById = async () => {
      if (!userId) return null
      user.value = await userService.getById(userId)
    }

    const getWorkerById = async () => {
      if (!workerId) return null
      try {
        isWorkerLoading.value = true
        worker.value = await workerService.getById(workerId)
        isWorkerLoading.value = false
      } catch (e) {
        isWorkerLoading.value = false
      }
    }
    const toggleDisableStatus = async () => {
      if (
        !workerId ||
        !store.getters.hasPermission('worker:userAdmin')
      )
        return null
      worker.value = await workerService.updateOne(workerId, {
        disabled: !worker.value?.disabled,
      })
    }

    const resendInvite = async() => {
      if (!workerId) return null
      worker.value = await workerService.sendInvite({
        workerId: workerId,
        userId: userId,
        roles: worker.value.roles,
      })
    }

    getUserById()
    getWorkerById()

    const isLoading = computed(
      () => isUserLoading.value || isWorkerLoading.value
    )

    const sendInvite = async ({ userId, roles, workerId }) => {
      if (roles.length === 0 || !workerId) return
      try {
        worker.value = await workerService.sendInvite({ userId, roles, workerId })
      } catch (e) {
        store.commit('setError', e.message)
      }
    }

    const isInviteSended = computed(
      () => worker?.value?.pending && worker?.value?.accepted
    )
    const setTmpUser = (data) => {
      tmpUser.value = Object.assign({}, data)
    }

    return {
      user,
      tmpUser,
      setTmpUser,
      isLoading,
      sendInvite,
      worker,
      isInviteSended,
      toggleDisableStatus,
      resendInvite,
    }
  },

  methods: {
    async searchUser() {
      if (!this.emailSearch) {
        this.setTmpUser({})
        return
      }
      const data = await workerService.getUserByEmail(this.emailSearch)
      if (!data) {
        this.setTmpUser({})
        this.$store.commit('setError', 'Пользователь не найден')
      } else this.setTmpUser(data)
    },

    async changeRoles(val) {
      this.tmpRoles = val
    },

    async updateRoles() {
      if (this.tmpRoles.length === 0 || !this.workerId) return
      const res = await workerService.updateOne(this.workerId, {
        roles: this.tmpRoles,
      })
      if (res) {
        this.tmpRoles = []
        this.$store.commit('setError', 'Роли обновлены')
      }
    },

  },
}
</script>
<style scoped>
.buttons-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}
</style>
