<template>
  <v-file-input
    :label="label"
    v-model="file"
    accept=".xlsx"
    :rules="rules"
    prepend-icon="mdi-microsoft-excel"
    @update:model-value="fileInputChanged"
  />
</template>
<script setup>
import { ref, computed } from 'vue'
import { xlsxToJson } from '@/shared/utils'

defineOptions({ name: 'XlsxFileInput' })

defineProps({
  label: {
    type: String,
    default: 'Select .XLSX file',
  },
})

const modelValue = defineModel({ type: Object })

const file = ref(null)

const rules = computed(() => [
  (v) => !!v || 'File is required',
  (v) => v?.size <= 5 * 1024 * 1024 || 'File size should not exceed 5 MB',
  (v) =>
    v?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    'Only .xlsx files are allowed',
])

async function fileInputChanged(val) {
  if (!val) {
    modelValue.value = null
    return
  }
  const res = await xlsxToJson(val)
  modelValue.value = res
}
</script>
<style lang=""></style>
