<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-progress-circular v-if="loading" indeterminate class="ma-4" />
        <driver-form
          v-else
          v-model="driver"
          :carrierItems="carrierStore.carriers"
          :displayDeleteBtn="store.getters.hasPermission('driver:delete')"
          :loading="loading"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { DriverService } from '@/shared/services'
import { DriverForm } from '@/entities/driver'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'DriverDetails' })

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const store = useStore()
const carrierStore = useCarrierStore()

const loading = ref(false)
const driver = ref(null)

onMounted(async () => {
  const id = props.id || route.params.id
  loading.value = true
  driver.value = await DriverService.getById(id)
  loading.value = false
})

async function submit(val) {
  try {
    loading.value = true
    const id = props.id || route.params.id
    const data = await DriverService.updateOne(id, val)
    loading.value = false
    if (data) {
      driver.value = data
      router.go(-1)
    }
  } catch (e) {
    loading.value = false
  }
}

function cancel() {
  router.go(-1)
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    loading.value = true
    const id = props.id || route.params.id
    await DriverService.deleteById(id)
    loading.value = false
    router.go(-1)
  }
}
</script>
<style></style>
