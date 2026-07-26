<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <CrewForm
          v-else
          :crew="crew"
          :carrierItems="carrierStore.carriers"
          :displayDeleteBtn="canDelete"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CrewService } from '@/shared/services'
import { CrewForm } from '@/features/crew'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'CrewDetails' })

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const loading = ref(false)
const crew = ref(null)

const canDelete = computed(() => store.getters.hasPermission('crew:delete'))

onMounted(async () => {
  loading.value = true
  try {
    crew.value = await CrewService.getById({ id: props.id, forEdit: true })
  } catch (e) {
    store.commit('setError', e?.message || e)
  } finally {
    loading.value = false
  }
})

async function submit(val) {
  loading.value = true
  try {
    crew.value = await CrewService.updateOne(props.id, val)
    router.go(-1)
  } catch (e) {
    store.commit('setError', e?.message || e)
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.go(-1)
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (!res) return

  loading.value = true
  try {
    await CrewService.deleteById(props.id)
    router.go(-1)
  } catch (e) {
    store.commit('setError', e?.message || e)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped></style>
