<template>
  <FormWrapper :loading="loading" @delete="deleteHandler" :displayDeleteBtn="showDeleteBtn">
    <PartnerForm
      :item="item"
      :clientAgreements="allClientAgreements"
      @cancel="cancel"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @changeNotifications="changeNotificationsHandler"
    />
  </FormWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as api from '@/entities/partner/api'
import { usePartnerStore } from '@/entities/partner'
import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/features/partner'
import { useAgreements } from '@/entities/agreement/useAgreements'
import { popContext } from '@/shared/composables/useReturnContext'

defineOptions({ name: 'PartnerDetails' })

const props = defineProps({
  id: String,
})

const router = useRouter()
const route = useRoute()
const store = useStore()

const { allClientAgreements } = useAgreements()
const partnerStore = usePartnerStore()

const item = ref(null)
const loading = ref(false)
const error = ref({ message: null, show: false })

const ctxId = route.query.ctx

const showDeleteBtn = computed(() => !!props?.id && store.getters.hasPermission('partner:delete'))

async function submit(val, saveOnly) {
  try {
    loading.value = true
    if (props.id) item.value = await api.updateById(props.id, val)
    else {
      item.value = await api.create(val)
      partnerStore.addPartnerLocally(item.value)
    }

    if (ctxId) {
      const ctx = popContext(ctxId)
      if (ctx) {
        router.push({
          path: ctx.from,
          query: { newPartnerId: item.value?._id, ...ctx.params },
        })
        return
      }
    }

    if (saveOnly && !props.id) router.replace(`/profile/partners/${item.value._id}`)
    else router.go(-1)
  } catch (e) {
    if (e.response?.status === 400 || e.response?.status === 403) {
      error.value = { message: e.response?.data, show: true }
    }
  } finally {
    loading.value = false
  }
}

function cancel() {
  if (ctxId) popContext(ctxId)
  router.go(-1)
}

function changeNotificationsHandler(items) {
  item.value = {
    ...item.value,
    idleTruckNotifications: [...items],
  }
}

async function deleteHandler() {
  try {
    loading.value = true
    await api.deleteById(props.id)
    loading.value = false

    if (ctxId) {
      const ctx = popContext(ctxId)
      if (ctx) {
        router.push({
          path: ctx.from,
          query: { clearedPartner: true, ...ctx.params },
        })
        return
      }
    }
    router.push('/profile/partners')
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}

watch(
  () => props.id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loading.value = true
      item.value = await api.getById(newVal)
      loading.value = false
    }
  },
  { immediate: true }
)
</script>
<style></style>
