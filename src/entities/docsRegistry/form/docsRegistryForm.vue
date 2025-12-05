<template>
  <div>
    <ButtonsPanel
      panelType="form"
      showSaveBtn
      :disabledSubmit="invalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <v-btn size="small" class="mx-2" @click="downloadXlsx">Скачать DOCX</v-btn>
    </ButtonsPanel>
    <div id="form">
      <div id="fields-row">
        <v-text-field
          v-if="state.number"
          label="Номер"
          :modelValue="state.number"
          readonly
         
          variant="outlined"
       density="compact"
          :style="{ maxWidth: '100px' }"
        />
        <v-select
          v-model="state.status"
          label="Статус"
          :items="statusItems"
         
          variant="outlined"
       density="compact"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          v-model="state.client"
          label="Клиент"
         
          required
          itemValue="_id"
          itemTitle="name"
          clearable
          variant="outlined"
       density="compact"
          :disabled="disabledMainFields"
          :items="clientItems"
          :style="{ maxWidth: '300px' }"
          :errorMessages="clientErrorMessages"
          @blur="v$.client.$touch"
          @update:model-value="changeClientHandler"
        />
        <v-select
          v-model="state.agreement"
          label="Соглашение"
         
          required
          itemValue="_id"
          itemTitle="name"
          clearable
          variant="outlined"
       density="compact"
          :disabled="disabledAgreements || disabledMainFields"
          :loading="loadingAgreements"
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
          :errorMessages="agreementErrorMessages"
          @blur="v$.agreement.$touch"
          @update:model-value="changeAgreementHandler"
        />

        <v-select
          v-model="state.placeForTransferDocs"
          label="Площадка"
         
          required
          clearable
          itemTitle="title"
          itemValue="address"
          variant="outlined"
       density="compact"
          :disabled="!placeItems || placeItems.length === 0 || disabledMainFields"
          :items="placeItems"
          :style="{ maxWidth: '300px' }"
          :errorMessages="placeErrorMessages"
          @blur="v$.placeForTransferDocs.$touch"
        />
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        class="ma-3"
        :disabled="!state.placeForTransferDocs || disabledPickOrders || needSave"
        @click="pickOrdersHandler"
      >
        Подобрать рейсы
      </v-btn>

      <v-text-field
        v-model="state.note"
        label="Примечание"
       
        variant="outlined"
       density="compact"
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
import useDocsRegistryForm from './useDocsRegistryForm.js'

export default {
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

    function downloadXlsx() {
      ctx.emit('downloadXlsx')
    }

    const clientItems = computed(() => store.getters?.partners.filter(i => i.isClient) || [])

    const statusItems = computed(() => store.getters.docsRegistryStatuses)

    const placeItems = computed(() => {
      if (!state.value?.client) return []
      const client = store.getters.partners.find(i => i._id === state.value.client)
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

      downloadXlsx,
      disabledAgreements,
      loadingAgreements,
      agreementItems,
      agreementErrorMessages,
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
