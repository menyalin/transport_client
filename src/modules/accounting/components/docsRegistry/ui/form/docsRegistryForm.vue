<template>
  <div>
    <buttons-panel
      panelType="form"
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
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
      />
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
import router from '@/router'
import store from '@/store'

import { computed, watch } from 'vue'
import { ButtonsPanel } from '@/shared/ui'
import useDocsRegistryForm from './useDocsRegistryForm'

export default {
  name: 'DocsRegistryForm',
  components: {
    ButtonsPanel,
  },
  props: {
    item: Object,
  },
  setup(props, ctx) {
    const { v$, state, invalidForm, clientErrorMessages, setFormState } =
      useDocsRegistryForm(props.item, ctx)

    function cancelHandler() {
      router.go(-1)
    }

    function submitHandler() {
      ctx.emit('submit', state.value)
    }

    const clientItems = computed(() =>
      store.getters.partners.filter((i) => i.isClient)
    )

    const statusItems = computed(() => store.getters.docsRegistryStatuses)
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
