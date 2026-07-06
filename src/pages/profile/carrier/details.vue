<template>
  <FormWrapper>
    <CarrierForm
      :item="carrier"
      :loading="loading || agreementsLoading"
      :displayDeleteBtn="$store.getters.hasPermission('carrier:delete')"
      :agreementItems="agreementItems"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CarrierForm } from '@/entities/carrier'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { FormWrapper } from '@/shared/ui'

defineOptions({ name: 'CarrierPage' })

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const carrierStore = useCarrierStore()
const carrier = ref(null)
const { items: agreementItems, loading: agreementsLoading } = useCarrierAgreements()

const loading = computed(() => carrierStore.loading)

async function submitHandler(val) {
  carrier.value = await carrierStore.updateOne(props.id, val)
  router.back()
}

async function cancelHandler() {
  router.push({ name: 'CarrierList' })
}

async function deleteHandler() {
  if (!props.id) return
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (!res) return
  await carrierStore.deleteOne(props.id)
  router.push({ name: 'CarrierList' })
}

onMounted(async () => {
  if (props.id) {
    carrier.value = await carrierStore.getById(props.id)
  }
})
</script>
<style></style>
