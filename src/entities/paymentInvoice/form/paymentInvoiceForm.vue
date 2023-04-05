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
      <v-btn small @click="downloadPdf" class="mx-2">Скачать PDF</v-btn>
      <v-btn small @click="downloadXlsx" class="mx-2">Скачать DOCX</v-btn>
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
          @change="changeAgreementHandler"
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
import { ButtonsPanel } from '@/shared/ui'
import usePaymentInvoiceForm from './usePaymentInvoiceForm.js'

export default {
  name: 'PaymentInvoiceForm',
  components: {
    ButtonsPanel,
  },
  props: {
    item: Object,
    disabledPickOrders: {
      type: Boolean,
    },
    disabledMainFields: {
      type: Boolean,
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
    } = usePaymentInvoiceForm(props.item, ctx)

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

    function downloadPdf() {
      ctx.emit('downloadPdf')
    }
    function downloadXlsx() {
      ctx.emit('downloadXlsx')
    }

    function changeAgreementHandler() {
      //TODO:
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
      downloadPdf,
      downloadXlsx,
      agreementItems,
      changeAgreementHandler,
    }
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
