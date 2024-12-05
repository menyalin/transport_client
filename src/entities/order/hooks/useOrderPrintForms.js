import { OrderService } from '@/shared/services'
import { getCurrentInstance, onMounted, ref, computed } from 'vue'

export const useOrderPrintForms = ({ order }) => {
  const permissionName = 'order:printForms'
  const templates = ref([])
  const downloadDisabled = ref(false)
  const { proxy } = getCurrentInstance()

  const docTemplateIsVisible = computed(() =>
    proxy.$store.getters.hasPermission(permissionName)
  )

  async function getTemplates() {
    if (proxy.$store.getters.hasPermission(permissionName)) {
      const res = await OrderService.getAllowedPrintForms()
      templates.value = res
    }
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
