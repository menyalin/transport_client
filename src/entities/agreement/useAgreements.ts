import { computed, onMounted, ref } from 'vue'

import { AgreementService } from '@/shared/services'

export const useAgreements = () => {
  const loading = ref(false)
  const allAgreements = ref([])

  onMounted(async () => {
    loading.value = true
    allAgreements.value = await AgreementService.getActiveAgreements()
    loading.value = false
  })

  const allClientAgreements = computed(() => {
    return allAgreements.value
      .filter((i) => !i.isOutsourceAgreement && i.isActive)
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  })

  return {
    allAgreements,
    allClientAgreements,
    loading,
  }
}
