<template>
  <form-wrapper :loading="loading" @delete="deleteHandler" :displayDeleteBtn="showDeleteBtn">
    <PartnerForm
      :item="item"
      :clientAgreements="allClientAgreements"
      @cancel="cancel"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @changeNotifications="changeNotificationsHandler"
    />
  </form-wrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PartnerService as service } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/entities/partner'
import { useAgreements } from '@/entities/agreement/useAgreements'

defineOptions({ name: 'PartnerDetails' })

const props = defineProps({
  id: String,
})

const router = useRouter()
const store = useStore()

const { allClientAgreements } = useAgreements()

const item = ref(null)
const loading = ref(false)
const error = ref({ message: null, show: false })

const showDeleteBtn = computed(() => !!props?.id && store.getters.hasPermission('partner:delete'))

async function submit(val, saveOnly) {
  try {
    loading.value = true
    if (props.id) item.value = await service.updateOne(props.id, val)
    else item.value = await service.create(val)

    if (saveOnly && !props.id) router.replace(`/profile/partners/${item.value._id}`)
    else if (!saveOnly) router.go(-1)
  } catch (e) {
    if (e.response?.status === 400 || e.response?.status === 403) {
      error.value = { message: e.response.data, show: true }
    }
  } finally {
    loading.value = false
  }
}

function cancel() {
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
    await service.deleteById(props.id)
    loading.value = false
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
      item.value = await service.getById(newVal)
      loading.value = false
    }
  },
  { immediate: true }
)
</script>
<style></style>
