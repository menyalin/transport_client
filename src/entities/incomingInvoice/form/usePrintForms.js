import dayjs from 'dayjs'
import { onMounted, ref, computed } from 'vue'
import { IncomingInvoiceService } from '@/shared/services'

export const usePrintForms = (props) => {
  const templates = ref([])
  const downloadDisabled = ref(false)

  const docTemplateIsVisible = computed(() => true)

  async function getTemplates() {
    const res = await IncomingInvoiceService.getAllowedPrintForms()
    templates.value = res
  }

  async function downloadTemplateHandler(template) {
    const invoiceId = props.item?._id
    const invoiceNumber = props.item?.number
    const invoiceDate = dayjs(props.item?.date).format('DD.MM.YYYY')
    if (!invoiceId) return
    const filename = `${template.filenamePattern} №${invoiceNumber} от ${invoiceDate}`

    await IncomingInvoiceService.downloadDoc(
      invoiceId,
      { templateName: template.templateName },
      filename
    )
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
