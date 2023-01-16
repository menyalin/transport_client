<template>
  <div>
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    />
    <div id="form">
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
        :items="clientItems"
        :style="{ maxWidth: '300px' }"
        @blur="v$.client.$touch"
        :error-messages="clientErrorMessages"
        @change="changeClientHandler"
      />
      <v-select
        label="Площадка"
        v-model="state.placeForTransferDocs"
        dense
        required
        clearable
        item-text="title"
        item-value="address"
        outlined
        :disabled="!placeItems || placeItems.length === 0"
        :items="placeItems"
        :style="{ maxWidth: '300px' }"
        @blur="v$.placeForTransferDocs.$touch"
        :error-messages="placeErrorMessages"
      />

      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="!state.placeForTransferDocs"
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
import useDocsRegistryForm from './useDocsRegistryForm.js'

export default {
  name: 'DocsRegistryForm',
  components: {
    ButtonsPanel,
  },
  props: {
    item: Object,
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

      changeClientHandler,
      showPickOrderDialog,
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
</style>
