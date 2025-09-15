import { onMounted, ref } from 'vue'
import store from '@/store/index'
import { DocTemplateService, PaymentInvoiceService } from '@/shared/services'

export const usePaymentInvoiceDocTemplates = (formState, props) => {
  const docTemplates = ref([])
  const newDocTemplates = ref([])

  async function newDownloadHandler(template) {
    const invoiceId = props.item?._id
    const filename = `${template.filenamePattern} №${formState.value.number} ${formState.value.date}`
    if (!invoiceId) {
      store.commit(
        'setError',
        'PaymentInvoice : download PF handler : invoice id is missing'
      )
      throw new Error(
        'PaymentInvoice : download PF handler : invoice id is missing'
      )
    }

    await PaymentInvoiceService.downloadDoc(
      props.item._id,
      { templateName: template.templateName },
      filename
    )
  }

  async function getAllowedPrintForms() {
    if (!formState.value.client || !formState.value.agreement) return
    const agreement = formState.value.agreement
    const client = formState.value.client
    newDocTemplates.value = await PaymentInvoiceService.getAllowedPrintForms(
      agreement,
      client
    )
  }

  async function getTemplates() {
    if (!formState.value.client) return null
    docTemplates.value = await DocTemplateService.getAllowedTemplates({
      agreement: formState.value.agreement,
      client: formState.value.client,
      type: 'paymentInvoice',
    })
  }
  async function updatePrintForms() {
    await getTemplates()
    await getAllowedPrintForms()
  }

  onMounted(async () => {
    await updatePrintForms()
  })

  return {
    docTemplates,
    newDocTemplates,
    newDownloadHandler,
    updatePrintForms,
  }
}
