import store from '@/store'
import { computed, ref, watch } from 'vue'
import { WorkerService } from '@/shared/services'

export const useLinkedUserModel = (props, ctx) => {
  const candidate = ref({})
  const roles = ref([])
  const loading = ref(false)
  const showUserInfo = computed(() => !!props.worker.user?._id || false)

  const hasPermission = computed(() =>
    store.getters.hasPermission('worker:userAdmin')
  )

  const disableRolesSelect = computed(() => !hasPermission.value)

  const showRolesSelect = computed(
    () => (hasPermission.value && candidate.value._id) || showUserInfo.value
  )

  const showPickUser = computed(() => hasPermission.value && !props.worker.user)

  const showSendInviteBtn = computed(
    () =>
      candidate.value._id && roles.value?.length > 0 && !props.worker.accepted
  )

  const showResendInviteBtn = computed(
    () =>
      !props.worker.accepted && !props.worker.pending && props.worker.user?._id
  )

  const isRolesNotChanged = computed(() => {
    return (
      props.worker.roles?.length === roles.value?.length &&
      roles.value.every((item) => props.worker.roles.includes(item))
    )
  })

  const showUpdateRolesBtn = computed(
    () => hasPermission.value && props.worker.user?._id
  )

  async function sendInviteHandler() {
    const workerId = props.worker._id
    const userId = candidate.value._id
    if (!workerId || !userId || roles.value?.length === 0) {
      store.commit('setError', 'required params is missing!')
      return
    }
    try {
      loading.value = true
      const updatedWorker = await WorkerService.sendInvite({
        userId,
        workerId,
        roles: roles.value,
      })
      loading.value = false
      ctx.emit('updateWorker', updatedWorker)
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async function resendInviteHandler() {
    const workerId = props.worker._id
    const userId = props.worker.user._id
    if (!workerId || !userId || roles.value?.length === 0) {
      store.commit('setError', 'required params is missing!')
      return
    }
    try {
      loading.value = true
      const updatedWorker = await WorkerService.sendInvite({
        userId,
        workerId,
        roles: roles.value,
      })
      loading.value = false
      ctx.emit('updateWorker', updatedWorker)
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  async function updateRoles() {
    if (!hasPermission.value) {
      store.commit('setError', 'Нарушение прав доступа!')
      return null
    }
    if (roles.value?.length === 0 || !props.worker._id) return null
    try {
      loading.value = true
      const updatedWorker = await WorkerService.updateOne(props.worker._id, {
        roles: roles.value,
      })
      loading.value = false
      ctx.emit('updateWorker', updatedWorker)
      store.commit('setError', 'Роли обновлены')
    } catch (e) {
      console.log(e)
      loading.value = false
      store.commit('setError', 'Ошибка обновления ролей сотрудника')
    }
  }

  async function toggleDisableStatus() {
    if (!props.worker._id || !hasPermission.value) return null
    try {
      loading.value = true
      const updatedWorker = await WorkerService.updateOne(props.worker._id, {
        disabled: !props.worker.disabled,
      })
      loading.value = false
      ctx.emit('updateWorker', updatedWorker)
    } catch (e) {
      loading.value = false
      store.commit('setError', JSON.stringify(e))
    }
  }

  watch(
    () => props.worker,
    (worker) => {
      roles.value = worker.roles
    },
    { immediate: true, deep: true }
  )

  return {
    showPickUser,
    showRolesSelect,
    showSendInviteBtn,
    showUserInfo,
    candidate,
    roles,
    disableRolesSelect,
    sendInviteHandler,
    showResendInviteBtn,
    resendInviteHandler,
    updateRoles,
    showUpdateRolesBtn,
    loading,
    isRolesNotChanged,
    toggleDisableStatus,
  }
}
