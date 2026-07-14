<template>
  <v-data-table
    :headers="headers"
    :items="prepatedItems"
    hide-default-footer
    :items-per-page="-1"
    item-key="id"
    class="elevation-1"
  >
    <template #[`item.note`]="{ item }">
      <v-text-field
        :model-value="item.note"
        hide-details
        @update:modelValue="changeNoteHandler(item.name, $event)"
      />
    </template>
    <template #[`item.size`]="{ item }">
      {{ formatSize(item.size) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <span v-if="item.progress > 0">{{ item.progress }} %</span>
      <v-icon v-else size="small" class="mr-2" @click="removeFileHandler(item.name)" color="red">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script setup>
import { watch, ref } from 'vue'
import { useEntityFileHelpers } from './utils/useEntityFileHelpers'

const items = defineModel({ type: Array, default: () => [] })

const props = defineProps({
  uploadProgress: Object,
})

const { formatSize } = useEntityFileHelpers()

const headers = [
  { key: 'name', title: 'Имя файла', sortable: false },
  { key: 'size', title: 'Размер файла', sortable: false, align: 'right' },
  { key: 'note', title: 'Описание', sortable: false },
  {
    key: 'actions',
    sortable: false,
    width: '7rem',
    align: 'right',
  },
]

const prepatedItems = ref([])

const refreshPrepatedItems = (progress, itemsVal) => {
  prepatedItems.value = Array.from(itemsVal).map((i) => {
    return {
      name: i.name,
      size: i.size,
      note: i.note,
      progress: progress[i.name] ?? 0,
    }
  })
}

const removeFileHandler = (fileName) => {
  const files = items.value?.filter((f) => f.name !== fileName)
  items.value = files
}

const changeNoteHandler = (filename, noteValue) => {
  const files = items.value.slice()
  const fileItem = files.find((i) => i.name === filename)
  fileItem.note = noteValue
  items.value = files
}

watch(
  [() => props.uploadProgress, () => items.value],
  (val) => {
    refreshPrepatedItems(val[0], val[1])
  },
  { deep: true, immediate: true }
)
</script>
