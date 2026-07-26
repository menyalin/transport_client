<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-progress-circular v-if="loading" indeterminate class="ma-4" />
        <TruckForm
          v-else
          v-model="truck"
          :carrierItems="carrierStore.carriers"
          :displayDeleteBtn="store.getters.hasPermission('truck:delete')"
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
import { TruckService } from '@/shared/services'
import { TruckForm } from '@/entities/truck'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'TruckDetails' })

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
const truck = ref(null)

onMounted(async () => {
  const id = props.id || route.params.id
  loading.value = true
  truck.value = await TruckService.getById(id)
  loading.value = false
})

async function submit(val) {
  try {
    loading.value = true
    const id = props.id || route.params.id
    const data = await TruckService.updateOne(id, val)
    loading.value = false
    if (data) {
      truck.value = data
      router.go(-1)
    }
  } catch {
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
    await TruckService.deleteById(id)
    loading.value = false
    router.go(-1)
  }
}
</script>
<style></style>
