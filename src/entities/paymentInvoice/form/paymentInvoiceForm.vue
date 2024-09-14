<template>
  <div>
    <buttons-panel
      panelType="form"
      showSaveBtn
      :disabledSubmit="invalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <download-doc-template-menu
        :templates="docTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        @download-template="downloadHandler"
      />
      <download-doc-template-menu
        :templates="newDocTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        class="mx-3"
        @download-template="newDownloadHandler"
      />
      <v-btn
        v-if="showLoaderBtn"
        class="mx-3"
        color="primary"
        @click="goToLoader"
      >
        Загрузить из реестра
      </v-btn>
      <span v-else-if="loaderPath" class="text-caption mx-3">
        Для использования загрузчика необходимо очистить список рейсов.
      </span>
    </buttons-panel>
    <div id="form">
      <div class="fields-row">
        <v-text-field
          v-model.trim="state.number"
          label="Номер"
          density="compact"
          variant="outlined"
          :style="{ maxWidth: '200px' }"
        />
        <v-text-field
          v-model="state.sendDate"
          label="Дата выставления"
          density="compact"
          variant="outlined"
          type="date"
          :style="{ maxWidth: '250px' }"
          @paste="pasteDate"
        />
        <v-select
          v-model="state.status"
          label="Статус"
          :items="statusItems"
          density="compact"
          variant="outlined"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          v-model="state.client"
          label="Клиент"
          density="compact"
          required
          item-value="_id"
          item-title="name"
          clearable
          variant="outlined"
          :disabled="disabledMainFields"
          :items="clientItems"
          :style="{ maxWidth: '300px' }"
          :error-messages="clientErrorMessages"
          @blur="v$.client.$touch"
          @update:model-value="changeClientHandler"
        />
        <v-autocomplete
          v-model="state.agreement"
          label="Соглашение"
          density="compact"
          required
          item-value="_id"
          item-title="name"
          clearable
          variant="outlined"
          :disabled="!state.client || disabledMainFields"
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
          :error-messages="agreementErrorMessages"
          @blur="v$.client.$touch"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          v-model.trim="state.numberByClient"
          label="Номер реестра клиента"
          density="compact"
          variant="outlined"
          :style="{ maxWidth: '200px' }"
        />
        <v-text-field
          v-model="state.dateByClient"
          label="Дата реестра клиента"
          density="compact"
          variant="outlined"
          type="date"
          :style="{ maxWidth: '250px' }"
          @paste="pasteDate"
        />
      </div>
      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        class="ma-3"
        :disabled="disabledPickOrders || needSave || invalidForm"
        @click="pickOrdersHandler"
      >
        Подобрать рейсы
      </v-btn>
      <v-text-field
        v-model="state.note"
        label="Примечание"
        density="compact"
        variant="outlined"
        hide-details
        @blur="v$.note.$touch"
      />
    </div>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import dayjs from 'dayjs'
import { defineComponent } from 'vue'
import { computed, watch, ref } from 'vue'

import { usePasteDateInput } from '@/modules/common/hooks/usePasteDateInput'
import router from '@/router'
import { ButtonsPanel, DownloadDocTemplateMenu } from '@/shared/ui'
import store from '@/store'

import { usePaymentInvoiceDocTemplates } from './usePaymentInvoiceDocTemplates'
import usePaymentInvoiceForm from './usePaymentInvoiceForm'

export default defineComponent({
  name: 'PaymentInvoiceForm',
  components: {
    ButtonsPanel,
    DownloadDocTemplateMenu,
  },
  props: {
    item: Object,
    disabledPickOrders: {
      type: Boolean,
    },
    disabledMainFields: {
      type: Boolean,
    },
    disabledDownloadFiles: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const showPickOrderDialog = ref(true)
    const { pasteDate } = usePasteDateInput()
    const {
      v$,
      state,
      invalidForm,
      clientErrorMessages,
      agreementErrorMessages,
      agreementItems,
      changeClientHandler,
      setFormState,
      loaderPath,
    } = usePaymentInvoiceForm(props.item, ctx)

    const { docTemplates, newDocTemplates, newDownloadHandler } =
      usePaymentInvoiceDocTemplates(state, props)

    const showLoaderBtn = computed(() => {
      if (Array.isArray(props.item.orders) && props.item.orders.length > 0)
        return false
      return (
        !!loaderPath.value && !props.disabledPickOrders && !invalidForm.value
      )
    })

    function cancelHandler() {
      router.go(-1)
    }

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }

    function submitHandler() {
      ctx.emit('submit', formState.value)
    }

    function saveHandler() {
      ctx.emit('save', formState.value)
    }

    function downloadHandler(filename) {
      ctx.emit('download', filename)
    }

    const clientItems = computed(
      () => store.getters?.partners.filter((i) => i.isClient) || []
    )

    const statusItems = computed(() => store.getters.docsRegistryStatuses)

    const needSave = computed(() => {
      return (
        state?.value.client !== props.item.client ||
        state?.value.agreement !== props.item.agreementId
      )
    })

    const formState = computed(() => {
      return {
        ...state.value,
        sendDate: state.value.sendDate
          ? dayjs(state.value.sendDate).format()
          : null,
      }
    })
    watch(
      () => props.item,
      () => {
        setFormState(props.item)
      },
      { immediate: true }
    )
    return {
      pasteDate,
      v$,
      cancelHandler,
      clientItems,
      statusItems,
      state,
      invalidForm,
      clientErrorMessages,
      submitHandler,
      saveHandler,
      agreementErrorMessages,
      pickOrdersHandler,
      needSave,
      changeClientHandler,
      showPickOrderDialog,
      downloadHandler,
      agreementItems,
      docTemplates,
      loaderPath,
      newDocTemplates,
      newDownloadHandler,
      showLoaderBtn,
    }
  },
  methods: {
    goToLoader() {
      if (!this.item._id || !this.loaderPath) return
      this.$router.replace({
        path: this.$route.path + '/' + this.loaderPath,
        query: {
          invoiceDate: this.state.sendDate,
          client: this.state.client,
          agreement: this.state.agreement,
        },
      })
    },
  },
})
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
}
.fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
