import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { popContext, getContext } from './useReturnContext'

/**
 * Хук для страниц создания/редактирования сущности, участвующих
 * в возвратном контексте (nested create/edit).
 *
 * @param {Object} service
 * @param {import('vue').Ref|string|() => string} id
 * @param {Object} options
 * @param {string} options.returnContextField - имя query-параметра при создании/сохранении
 * @param {string} options.returnContextClearField - имя query-параметра при удалении
 * @param {string} [options.detailsRouteName] - имя роута для редиректа после create в режиме saveOnly
 */
export function useReturnContextPage(service, id, options = {}) {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const ctxId = route.query.ctx

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

  async function submit(val, saveOnly = false) {
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

      if (ctxId) {
        const ctx = popContext(ctxId)
        if (ctx && options.returnContextField) {
          router.replace({
            path: ctx.from,
            query: {
              [options.returnContextField]: item.value?._id,
              ...ctx.params,
            },
          })
          return
        }
      }

      if (saveOnly) {
        if (!getId() && options.detailsRouteName) {
          router.replace({
            name: options.detailsRouteName,
            params: { id: item.value?._id },
          })
        }
        return
      }

      router.go(-1)
    } catch (e) {
      loading.value = false
      item.value = tmpVal.value
      if (e.response?.status === 400 || e.response?.status === 403) {
        error.value = { message: e.response?.data, show: true }
      } else {
        store.commit('setError', e.message)
      }
    }
  }

  async function deleteHandler() {
    try {
      loading.value = true
      await service.deleteById(getId())
      loading.value = false

      if (ctxId) {
        const ctx = popContext(ctxId)
        if (ctx && options.returnContextClearField) {
          router.replace({
            path: ctx.from,
            query: { [options.returnContextClearField]: true, ...ctx.params },
          })
          return
        }
      }
      router.go(-1)
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  function cancel() {
    if (ctxId) {
      popContext(ctxId)
    }
    router.go(-1)
  }

  return {
    item,
    loading,
    error,
    toggleAlert,
    submit,
    deleteHandler,
    cancel,
    isReturnContext: !!getContext(ctxId),
  }
}
