import store from '@/store'
import { ref, onMounted } from 'vue'
import { CompanyService } from '@/shared/services'

export const useCompany = () => {
  const loading = ref(false)
  const allCompanyItems = ref([])

  async function getAllCompanies() {
    try {
      loading.value = true
      allCompanyItems.value = await CompanyService.getMyCompanies()
    } catch (e) {
      store.commit('setError', e.message)
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await getAllCompanies()
  })

  return {
    allCompanyItems,
    loading,
  }
}
