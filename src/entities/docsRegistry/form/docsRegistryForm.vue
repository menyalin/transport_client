<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      show-save-btn
      @cancel="cancelHandler"
      :disabled-submit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <v-btn size="small" @click="downloadXlsx" class="mx-2">Скачать DOCX</v-btn>
    </ButtonsPanel>
    <div id="form">
      <div id="fields-row">
        <v-text-field
          v-if="state.number"
          label="Номер"
          v-model="state.number"
          readonly
          :style="{ maxWidth: '100px' }"
        />
        <v-select
          label="Статус"
          v-model="state.status"
          :items="statusItems"
          item-value="value"
          item-title="text"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          v-model="state.client"
          label="Клиент"
          required
          item-value="_id"
          item-title="name"
          clearable
          :disabled="disabledMainFields"
          :items="clientItems"
          :style="{ maxWidth: '300px' }"
          @blur="v$.client.$touch"
          :error-messages="clientErrorMessages"
          @update:model-value="changeClientHandler"
        />
        <v-select
          v-model="state.agreement"
          label="Соглашение"
          required
          item-value="_id"
          item-title="name"
          clearable
          :disabled="disabledAgreements || disabledMainFields"
          :loading="loadingAgreements"
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
          @blur="v$.agreement.$touch"
          :error-messages="agreementErrorMessages"
          @update:model-value="changeAgreementHandler"
        />

        <v-select
          label="Площадка"
          v-model="state.placeForTransferDocs"
          required
          clearable
          item-value="address"
          item-title="address"
          :disabled="!placeItems || placeItems.length === 0 || disabledMainFields"
          :items="placeItems"
          :style="{ maxWidth: '300px' }"
          @blur="v$.placeForTransferDocs.$touch"
          :error-messages="placeErrorMessages"
        />
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="!state.placeForTransferDocs || disabledPickOrders || needSave"
      >
        Подобрать рейсы
      </v-btn>

      <v-text-field v-model="state.note" label="Примечание" @blur="v$.note.$touch" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel } from '@/shared/ui'
import useDocsRegistryForm from './useDocsRegistryForm.js'

defineOptions({ name: 'DocsRegistryForm' })

const props = defineProps({
  item: Object,
  disabledPickOrders: {
    type: Boolean,
  },
  disabledMainFields: {
    type: Boolean,
  },
})

const emit = defineEmits(['cancel', 'submit', 'save', 'pickOrders', 'downloadXlsx'])

const router = useRouter()
const vuexStore = useStore()

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
} = useDocsRegistryForm()

function cancelHandler() {
  router.go(-1)
}

function pickOrdersHandler() {
  emit('pickOrders')
}

function submitHandler() {
  emit('submit', state.value)
}

function changeClientHandler() {
  state.value.placeForTransferDocs = null
}

function saveHandler() {
  emit('save', state.value)
}

function downloadXlsx() {
  emit('downloadXlsx')
}

const clientItems = computed(() => vuexStore.getters?.partners.filter((i) => i.isClient) || [])

const statusItems = computed(() => vuexStore.getters.docsRegistryStatuses)

const placeItems = computed(() => {
  if (!state.value?.client) return []
  const client = vuexStore.getters.partners.find((i) => i._id === state.value.client)
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
