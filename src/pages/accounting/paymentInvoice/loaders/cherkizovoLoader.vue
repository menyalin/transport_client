<template>
  <FormWrapper>
    <ButtonsPanel
      panelType="form"
      submitTitle="Загрузить"
      @submit="submitHandler"
      @cancel="cancelHandler"
    />
    <XlsxFileInput label="Укажите файл с реестром" @change="uploadHandler" />
    <UploadedInfo :items="uploadedOrders" :errors="errors" />
  </FormWrapper>
</template>

<script>
import { FormWrapper, ButtonsPanel } from '@/shared/ui'
import { XlsxFileInput } from '@/shared/ui/index'
import { ParsedOrderDTO, usePageData } from './cherkizovoLoader.model'
import UploadedInfo from './uploadedInfo.vue'
export default {
  name: 'CherkizovoInvoiceLoaderPage',
  props: {
    id: String,
  },
  components: {
    FormWrapper,
    ButtonsPanel,
    XlsxFileInput,
    UploadedInfo,
  },
  data() {
    return {
      uploadedOrders: [],
      errors: [],
    }
  },
  setup() {
    const { pickOrdersByClientNumbers } = usePageData()
    return { pickOrdersByClientNumbers }
  },
  mounted() {
    if (sessionStorage.getItem(this.id))
      this.uploadedOrders = JSON.parse(sessionStorage.getItem(this.id))?.map(
        (i) => new ParsedOrderDTO(i)
      )
  },
  methods: {
    clearUploadedOrders() {
      this.uploadedOrders = []
      this.errors = []
    },
    submitHandler() {
      console.log('submit handler')
    },
    cancelHandler() {
      console.log(this.id)
      console.log(this.$route)
    },
    uploadHandler(uploadData) {
      if (!uploadData || !uploadData.length) {
        this.clearUploadedOrders()
        return
      }
      try {
        this.uploadedOrders = Object.assign(
          [],
          uploadData.map((i) => new ParsedOrderDTO(i))
        )
        sessionStorage.setItem(this.id, JSON.stringify(this.uploadedOrders))
      } catch (e) {
        this.errors.push(e)
      }
    },
  },
}
</script>
<style scoped></style>
