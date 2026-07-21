<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <truck-form
          :loading="loading"
          :carrierItems="carrierStore.carriers"
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { TruckForm } from '@/entities/truck'

defineOptions({ name: 'TruckCreate' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const loading = ref(false)

function submit(truck) {
  loading.value = true
  store
    .dispatch('truckCreate', truck)
    .then(() => {
      loading.value = false
      router.push({ name: 'TruckList' })
    })
    .catch((e) => {
      loading.value = false
      store.commit('setError', e)
    })
}

function cancel() {
  router.go(-1)
}
</script>
<style></style>
