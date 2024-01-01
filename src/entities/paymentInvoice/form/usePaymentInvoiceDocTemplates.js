import { onMounted, ref, watch } from 'vue'
import store from '@/store/index'
import { DocTemplateService } from '@/shared/services'
import { PaymentInvoiceService } from '@/shared/services'

export const usePaymentInvoiceDocTemplates = (formState, props) => {
  const docTemplates = ref([])
  const newDocTemplates = ref([])

  async function newDownloadHandler(template) {
    const invoiceId = props.item?._id
    const filename = `${template.filenamePattern} №${formState.value.number} ${formState.value.sendDate}`
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
      client: formState.value.client,
      type: 'paymentInvoice',
    })
  }

  onMounted(async () => {
    await getAllowedPrintForms()
  })

  watch(formState, getTemplates)
  return {
    docTemplates,
    newDocTemplates,
    newDownloadHandler,
  }
}
