<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    no-data-text="Файлы отсутствуют"
    hide-default-footer
  >
    <template #[`item.icon`]="{ item }">
      <v-icon :title="item.contentType">{{ mimeTypeToIcon(item.contentType) }}</v-icon>
    </template>
    <template #[`item.note`]="{ item }">
      <v-menu v-model="item._menuOpen" :close-on-content-click="false">
        <template #activator="{ props }">
          <span v-bind="props" class="cursor-pointer">{{ item.note }}</span>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              v-model="item.note"
              label="Описание"
              autofocus
              :density="'compact'"
              :variant="'underlined'"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="item._menuOpen = false">Отмена</v-btn>
            <v-btn @click="saveNote(item)">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
    <template #[`item.size`]="{ item }">
      <span v-if="item.size">{{ formatSize(item.size) }}</span>
      <span v-else class="text-grey">~</span>
    </template>
    <template #[`item.uploadDate`]="{ item }">
      <span v-if="item.uploadDate">{{ formatDate(item.uploadDate) }}</span>
      <span v-else class="text-grey">~</span>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="actions-wrapper">
        <v-icon color="primary" size="small" @click="downloadItemHandler(item)">
          {{ 'mdi-download' }}
        </v-icon>
        <v-icon color="red" size="small" @click="removeItemHandler(item)">
          {{ 'mdi-delete' }}
        </v-icon>
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref } from 'vue'
import { useEntityFileHelpers } from './utils/useEntityFileHelpers'

defineOptions({ name: 'FileList' })

defineProps({
  items: {
    type: Array,
    required: true,
    validator: function (value) {
      return value.every(
        (file) =>
          '_id' in file &&
          'docId' in file &&
          'key' in file &&
          'originalName' in file &&
          'status' in file
      )
    },
  },
})

const emit = defineEmits(['updateNote', 'remove', 'download'])

const { formatSize, formatDate, mimeTypeToIcon } = useEntityFileHelpers()

const headers = ref([
  { key: 'icon', width: '2rem', align: 'center' },
  { title: 'Имя файла', key: 'originalName' },
  { title: 'Описание', key: 'note' },
  { title: 'Размер', key: 'size', align: 'right' },
  { title: 'Дата загрузки', key: 'uploadDate' },
  { key: 'actions', align: 'center', sortable: false, width: '75px' },
])

const saveNote = (item) => {
  item._menuOpen = false
  emit('updateNote', item)
}

const removeItemHandler = async (item) => {
  const res = confirm(`<b>Удалить?</b> <br/> файл: ${item.originalName}`)
  if (res) emit('remove', item.key)
}

const downloadItemHandler = (item) => {
  emit('download', item)
}
</script>
<style scoped>
.actions-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
