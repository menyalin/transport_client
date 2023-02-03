<template>
  <div>
    <buttons-panel
      panelType="form"
      @cancel="cancelHandler"
      @submit="submitHandler"
      :disabledSubmit="invalidForm"
    />
    <div class="form-wrapper">
      <v-text-field
        v-model="state.fullName"
        label="Полное названии компании"
        dense
        required
        clearable
        outlined
        @blur="v$.fullName.$touch"
        :error-messages="fullNameErrorMessages"
        :style="{ maxWidth: '400px' }"
      />
    </div>
  </div>
</template>
<script>
import { watch } from 'vue'
import router from '@/router'
import { ButtonsPanel } from '@/shared/ui'
import { useBaseFieldsForm } from './useBaseFieldsForm.js'
export default {
  name: 'CompanyBaseFieldsForm',
  components: { ButtonsPanel },
  props: {
    item: { type: Object, required: true },
  },
  setup(props, ctx) {
    const { v$, state, invalidForm, fullNameErrorMessages, setFormState } =
      useBaseFieldsForm(props.item)

    function cancelHandler() {
      router.go(-1)
    }

    function submitHandler() {
      ctx.emit('submit', state.value)
    }

    function saveHandler() {
      ctx.emit('save', state.value)
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
      state,
      invalidForm,
      fullNameErrorMessages,
      submitHandler,
      saveHandler,
    }
  },
}
</script>
<style scoped>
.form-wrapper {
  display: flex;
  margin: 20px;
  flex-direction: column;
  gap: 10px;
}
</style>
