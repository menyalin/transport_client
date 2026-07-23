<template>
  <div>
    <buttons-panel
      panel-type="form"
      @cancel="cancelHandler"
      @submit="submitHandler"
      :disabled-submit="invalidForm"
    />
    <div class="form-wrapper">
      <v-text-field
        v-model="state.fullName"
        label="Полное названии компании"
        required
        clearable
        @blur="v$.fullName.$touch"
        :error-messages="fullNameErrorMessages"
        :style="{ maxWidth: '400px' }"
      />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { ButtonsPanel } from '@/shared/ui'
import { useBaseFieldsForm } from './useBaseFieldsForm.js'

defineOptions({ name: 'CompanyBaseFieldsForm' })

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['submit', 'save'])

const router = useRouter()

const { v$, state, invalidForm, fullNameErrorMessages, setFormState } = useBaseFieldsForm(
  props.item
)

function cancelHandler() {
  router.go(-1)
}

function submitHandler() {
  emit('submit', state.value)
}

watch(
  () => props.item,
  () => {
    setFormState(props.item)
  },
  { immediate: true }
)
</script>

<style scoped>
.form-wrapper {
  display: flex;
  margin: 20px;
  flex-direction: column;
  gap: 10px;
}
</style>
