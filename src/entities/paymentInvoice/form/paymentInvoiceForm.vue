<template>
  <div>
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <download-doc-template-menu
        :templates="docTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        @downloadTemplate="downloadHandler"
      />
      <download-doc-template-menu
        :templates="newDocTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        @downloadTemplate="newDownloadHandler"
        class="mx-3"
      />
      <v-btn v-if="loaderPath" class="mx-3" @click="goToLoader" color="primary">
        Загрузить из реестра
      </v-btn>
    </buttons-panel>
    <div id="form">
      <div id="fields-row">
        <v-text-field
          label="Номер"
          v-model.trim="state.number"
          dense
          outlined
          :style="{ maxWidth: '150px' }"
        />
        <v-text-field
          label="Дата выставления"
          v-model="state.sendDate"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <v-select
          label="Статус"
          v-model="state.status"
          :items="statusItems"
          dense
          outlined
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          v-model="state.client"
          label="Клиент"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="disabledMainFields"
          :items="clientItems"
          :style="{ maxWidth: '300px' }"
          @blur="v$.client.$touch"
          :error-messages="clientErrorMessages"
          @change="changeClientHandler"
        />
        <v-autocomplete
          v-model="state.agreement"
          label="Соглашение"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="!state.client || disabledMainFields"
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
          @blur="v$.client.$touch"
          :error-messages="agreementErrorMessages"
        />
      </div>
      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="disabledPickOrders || needSave"
      >
        Подобрать рейсы
      </v-btn>
      <v-text-field
        v-model="state.note"
        label="Примечание"
        dense
        outlined
        @blur="v$.note.$touch"
        hide-details
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { computed, watch, ref } from 'vue'
import router from '@/router'
import store from '@/store'
import { ButtonsPanel, DownloadDocTemplateMenu } from '@/shared/ui'
import usePaymentInvoiceForm from './usePaymentInvoiceForm.js'
import { usePaymentInvoiceDocTemplates } from './usePaymentInvoiceDocTemplates.js'

export default {
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
      return state?.value.client !== props.item.client
    })
    function buttonClick() {
      console.log('click')
    }

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
      buttonClick,
      changeClientHandler,
      showPickOrderDialog,
      downloadHandler,
      agreementItems,
      docTemplates,
      loaderPath,
      newDocTemplates,
      newDownloadHandler,
    }
  },
  methods: {
    goToLoader() {
      if (!this.item._id || !this.loaderPath) return
      console.log(this.state)
      this.$router.push({
        path: this.$route.path + '/' + this.loaderPath,
        query: {
          invoiceDate: this.state.sendDate,
          client: this.state.client,
          agreement: this.state.agreement,
        },
      })
    },
  },
}
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
}
#fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
