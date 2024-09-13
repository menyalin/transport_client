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
      <v-btn small class="mx-2" @click="downloadPdf">Скачать PDF</v-btn>
      <v-btn small class="mx-2" @click="downloadXlsx">Скачать DOCX</v-btn>
    </buttons-panel>
    <div id="form">
      <div id="fields-row">
        <v-text-field
          v-if="state.number"
          label="Номер"
          :value="state.number"
          readonly
          dense
          outlined
          :style="{ maxWidth: '100px' }"
        />
        <v-select
          v-model="state.status"
          label="Статус"
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
          :error-messages="clientErrorMessages"
          @blur="v$.client.$touch"
          @change="changeClientHandler"
        />
        <v-select
          v-model="state.agreement"
          label="Соглашение"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="disabledAgreements || disabledMainFields"
          :loading="loadingAgreements"
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
          :error-messages="agreementErrorMessages"
          @blur="v$.agreement.$touch"
          @change="changeAgreementHandler"
        />

        <v-select
          v-model="state.placeForTransferDocs"
          label="Площадка"
          dense
          required
          clearable
          item-text="title"
          item-value="address"
          outlined
          :disabled="
            !placeItems || placeItems.length === 0 || disabledMainFields
          "
          :items="placeItems"
          :style="{ maxWidth: '300px' }"
          :error-messages="placeErrorMessages"
          @blur="v$.placeForTransferDocs.$touch"
        />
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        class="ma-3"
        :disabled="
          !state.placeForTransferDocs || disabledPickOrders || needSave
        "
        @click="pickOrdersHandler"
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

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { computed, watch } from 'vue'

import router from '@/router'
import { ButtonsPanel } from '@/shared/ui'
import store from '@/store'

import useDocsRegistryForm from './useDocsRegistryForm'

export default defineComponent({
  name: 'DocsRegistryForm',
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
      disabledAgreements,
      loadingAgreements,
      agreementItems,
      agreementErrorMessages,
      changeAgreementHandler,
    } = useDocsRegistryForm(props.item, ctx)

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
      changeClientHandler,
      showPickOrderDialog,
      downloadPdf,
      downloadXlsx,
      disabledAgreements,
      loadingAgreements,
      agreementItems,
      agreementErrorMessages,
      changeAgreementHandler,
    }
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
#fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
