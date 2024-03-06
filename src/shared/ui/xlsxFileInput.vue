<template>
  <v-file-input
    v-model="file"
    :rules="rules"
    accept=".xlsx"
    :label="label"
    prepend-icon="mdi-microsoft-excel"
    @change="fileInputChanged"
  />
</template>
<script>
import { xlsxToJson } from '@/shared/utils'
export default {
  name: 'XlsxFileInput',
  props: {
    label: {
      type: String,
      default: 'Select .XLSX file',
    },
  },
  data() {
    return {
      file: null,
    }
  },
  computed: {
    rules() {
      return [
        (v) => !!v || 'File is required',
        (v) => v?.size <= 5 * 1024 * 1024 || 'File size should not exceed 5 MB',
        (v) =>
          v?.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          'Only .xlsx files are allowed',
      ]
    },
  },
  methods: {
    async fileInputChanged(file) {
      if (!file) {
        this.$emit('change', null)
        return
      }
      const res = await xlsxToJson(file)
      this.$emit('change', res)
    },
  },
}
</script>
<style lang=""></style>
