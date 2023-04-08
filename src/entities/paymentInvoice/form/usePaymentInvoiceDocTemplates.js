import { ref, watch } from 'vue'
import { DocTemplateService } from '@/shared/services'

export const usePaymentInvoiceDocTemplates = (formState) => {
  const docTemplates = ref([])

  async function getTemplates() {
    if (!formState.value.client) return null

    docTemplates.value = await DocTemplateService.getAllowedTemplates({
      client: formState.value.client,
      type: 'paymentInvoice',
    })
  }

  watch(formState, getTemplates)
  return {
    docTemplates,
  }
}
