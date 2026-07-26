<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <CrewForm
          :loading="loading"
          :carrierItems="carrierStore.carriers"
          :disabledSubmit="!canWrite"
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { CrewForm } from '@/features/crew'

defineOptions({ name: 'CrewCreate' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()
const loading = ref(false)

const canWrite = computed(() => store.getters.hasPermission('crew:write'))

async function submit(item) {
  loading.value = true
  try {
    await store.dispatch('createCrew', item)
    router.push({ name: 'CrewList' })
  } catch (e) {
    store.commit('setError', e)
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.go(-1)
}
</script>
<style scoped></style>
