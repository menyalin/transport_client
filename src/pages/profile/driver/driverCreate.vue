<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <DriverForm
          v-model="driver"
          :carrierItems="carrierStore.carriers"
          :loading="loading"
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
import { DriverForm } from '@/entities/driver'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'DriverCreate' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const loading = ref(false)
const driver = ref(null)

function submit(driver) {
  loading.value = true
  store
    .dispatch('driverCreate', driver)
    .then(() => {
      loading.value = false
      router.push({ name: 'DriverList' })
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
