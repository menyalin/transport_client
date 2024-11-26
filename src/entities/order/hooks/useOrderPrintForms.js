import { OrderService } from '@/shared/services'
import { onMounted, ref } from 'vue'

export const useOrderPrintForms = ({ order }) => {
  const docTemplateIsVisible = ref(true)
  const downloadDisabled = ref(false)
  const templates = ref([])

  async function getTemplates() {
    const res = await OrderService.getAllowedPrintForms()
    templates.value = res
  }

  async function downloadTemplateHandler(template) {
    await OrderService.downloadDoc(order._id, {
      templateName: template.templateName,
    })
  }

  onMounted(async () => {
    await getTemplates()
  })

  return {
    downloadDisabled,
    docTemplateIsVisible,
    templates,
    downloadTemplateHandler,
  }
}
