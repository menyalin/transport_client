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
        density="compact"
        hide-details
        @update:model-value="changeNoteHandler(item.name, $event)"
      />
    </template>
    <template #[`item.size`]="{ item }">
      {{ formatSize(item.size) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <span v-if="item.progress > 0">{{ item.progress }} %</span>
      <v-icon
        v-else
        size="small"
        class="mr-2"
        color="red"
        @click="removeFileHandler(item.name)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { watch, ref } from 'vue'
import { useEntityFileHelpers } from './utils/useEntityFileHelpers'

export default {
  name: 'SelectedFiles',
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
    uploadProgress: Object,
  },

  setup(props, ctx) {
    const { formatSize } = useEntityFileHelpers()

    const headers = [
      { value: 'name', text: 'Имя файла', sortable: false },
      { value: 'size', text: 'Размер файла', sortable: false, align: 'right' },
      { value: 'note', text: 'Описание', sortable: false },
      {
        value: 'actions',
        sortable: false,
        width: '7rem',
        align: 'right',
      },
    ]

    const prepatedItems = ref([])

    const refreshPrepatedItems = (progress, items) => {
      prepatedItems.value = Array.from(items).map((i) => {
        return {
          name: i.name,
          size: i.size,
          note: i.note,
          progress: progress[i.name] ?? 0,
        }
      })
    }

    const removeFileHandler = (fileName) => {
      const files = props.items?.filter((f) => f.name !== fileName)
      ctx.emit('change', files)
    }

    const changeNoteHandler = (filename, noteValue) => {
      const files = props.items.slice()
      const item = files.find((i) => i.name === filename)
      item.note = noteValue
      ctx.emit('change', files)
    }

    watch(
      [() => props.uploadProgress, () => props.items],
      (val) => {
        refreshPrepatedItems(val[0], val[1])
      },
      { deep: true, immediate: true }
    )

    return {
      headers,
      removeFileHandler,
      changeNoteHandler,
      formatSize,
      prepatedItems,
    }
  },
}
</script>
