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
          v-if="state.number"
          label="Номер"
          :value="state.number"
          dense
          outlined
          :style="{ maxWidth: '100px' }"
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
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="
          !state.placeForTransferDocs || disabledPickOrders || needSave
        "
      >
        Подобрать рейсы
      </v-btn>

      <v-text-field
        v-model="state.note"
        label="Примечание"
        dense
        outlined
        @blur="v$.note.$touch"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'
import store from '@/store'

import { computed, watch } from 'vue'
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
      placeErrorMessages,
      setFormState,
    } = usePaymentInvoiceForm(props.item, ctx)

    function cancelHandler() {
      router.go(-1)
    }

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }

    function submitHandler() {
      ctx.emit('submit', state.value)
    }

    function changeClientHandler() {
      state.value.placeForTransferDocs = null
    }

    function saveHandler() {
      ctx.emit('save', state.value)
    }

    function downloadPdf() {
      ctx.emit('downloadPdf')
    }
    function downloadXlsx() {
      ctx.emit('downloadXlsx')
    }

    const clientItems = computed(
      () => store.getters?.partners.filter((i) => i.isClient) || []
    )

    const statusItems = computed(() => store.getters.docsRegistryStatuses)

    const placeItems = computed(() => {
      if (!state.value?.client) return []
      const client = store.getters.partners.find(
        (i) => i._id === state.value.client
      )
      if (!client) return []
      return client.placesForTransferDocs
    })
    const needSave = computed(() => {
      return (
        state.value?.client !== props.item.client ||
        state.value.placeForTransferDocs !== props.item.placeForTransferDocs
      )
    })
    function buttonClick() {
      console.log('click')
    }
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
      placeItems,
      placeErrorMessages,
      pickOrdersHandler,
      needSave,
      buttonClick,
      changeClientHandler,
      showPickOrderDialog,
      downloadPdf,
      downloadXlsx,
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
