<template>
  <FormWrapper :loading="loading" @delete="deleteHandler" :displayDeleteBtn="!!id && canDelete">
    <WorkerForm :item="worker" @cancel="cancel" @submit="submit" />
    <LinkedUser v-if="id" :worker="worker" @updateWorker="updateWorkerHandler" />
  </FormWrapper>
</template>

<script setup>
defineOptions({ name: 'WorkerDetails' })
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormWrapper } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import { WorkerForm } from '@/features/worker'
import { LinkedUser } from '@/widgets/worker'

const props = defineProps({
  id: String,
})

const router = useRouter()
const store = useStore()

const worker = ref({})
const loading = ref(false)

const canDelete = computed(() => store.getters.hasPermission('worker:delete'))

async function getWorker() {
  if (!props.id) return
  try {
    loading.value = true
    worker.value = await WorkerService.getById(props.id)
    loading.value = false
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}

function updateWorkerHandler(updatedWorker) {
  worker.value = updatedWorker
}

async function submit(val) {
  try {
    if (props.id) await WorkerService.updateOne(props.id, val)
    else await WorkerService.create(val)
    router.go(-1)
  } catch (e) {
    store.commit('setError', e)
  }
}

function cancel() {
  router.go(-1)
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    try {
      await WorkerService.deleteById(props.id)
      router.go(-1)
    } catch (e) {
      store.commit('setError', e.message)
    }
  }
}

onMounted(() => {
  getWorker()
})
</script>
