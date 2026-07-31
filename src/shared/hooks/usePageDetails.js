import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function usePageDetails(service, id, { emit, openInModal = false } = {}) {
  const router = useRouter()
  const store = useStore()

  const item = ref(null)
  const loading = ref(false)
  const tmpVal = ref(null)
  const error = ref({ message: null, show: false })

  function getId() {
    return typeof id === 'function' ? id() : id.value
  }

  watch(
    id,
    async (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        loading.value = true
        item.value = await service.getById(newVal)
        loading.value = false
      }
    },
    { immediate: true }
  )

  function toggleAlert() {
    error.value = { show: false, message: null }
  }

  async function submit(val) {
    tmpVal.value = val
    try {
      loading.value = true
      if (getId()) {
        item.value = await service.updateOne(getId(), val)
      } else {
        item.value = await service.create(val)
      }
      loading.value = false
      tmpVal.value = null
      if (openInModal && emit) {
        emit('submit', item.value._id)
      } else {
        router.go(-1)
      }
    } catch (e) {
      loading.value = false
      item.value = tmpVal.value
      if (e.response?.status === 400 || e.response?.status === 403) {
        error.value = { message: e.response?.data, show: true }
      }
    }
  }

  function cancel() {
    if (openInModal && emit) {
      emit('cancel')
    } else {
      router.go(-1)
    }
  }

  async function deleteHandler() {
    const res = confirm('Вы действительно хотите удалить запись?')
    if (res) {
      try {
        loading.value = true
        await service.deleteById(getId())
        loading.value = false
        router.go(-1)
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }
  }

  return {
    item,
    loading,
    tmpVal,
    error,
    toggleAlert,
    submit,
    cancel,
    deleteHandler,
  }
}
