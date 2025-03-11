<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    no-data-text="Файлы отсутствуют"
    hide-default-footer
  >
    <template #[`item.icon`]="{ item }">
      <v-icon :title="item.contentType">{{
        mimeTypeToIcon(item.contentType)
      }}</v-icon>
    </template>
    <template #[`item.note`]="{ item }">
      <span v-if="item.note">{{ item.note }}</span>
      <span v-else class="grey--text">(пусто)</span>
    </template>
    <template #[`item.size`]="{ item }">
      <span v-if="item.size">{{ formatSize(item.size) }}</span>
      <span v-else class="grey--text">~</span>
    </template>
    <template #[`item.uploadDate`]="{ item }">
      <span v-if="item.uploadDate">{{ formatDate(item.uploadDate) }}</span>
      <span v-else class="grey--text">~</span>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="actions-wrapper">
        <v-icon color="primary" small @click="downloadItemHandler(item)">
          {{ 'mdi-download' }}
        </v-icon>
        <v-icon color="red" small @click="removeItemHandler(item.key)">
          {{ 'mdi-delete' }}
        </v-icon>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { useEntityFileHelpers } from './utils/useEntityFileHelpers'
export default {
  name: 'FileList',
  props: {
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
  },
  setup(_props, ctx) {
    const { proxy } = getCurrentInstance()
    const { formatSize, formatDate, mimeTypeToIcon } = useEntityFileHelpers()
    const headers = ref([
      { value: 'icon', width: '2rem', align: 'center' },
      { text: 'Имя файла', value: 'originalName' },
      { text: 'Описание', value: 'note' },
      { text: 'Размер', value: 'size', align: 'right' },
      { text: 'Дата загрузки', value: 'uploadDate' },
      { value: 'actions', align: 'center', sortable: false, width: '75px' },
    ])

    const removeItemHandler = async (key) => {
      const res = await proxy.$confirm('Уверены?')
      if (res) ctx.emit('remove', key)
    }

    const downloadItemHandler = (item) => {
      ctx.emit('download', item)
    }

    return {
      headers,
      formatSize,
      formatDate,
      mimeTypeToIcon,
      removeItemHandler,
      downloadItemHandler,
    }
  },
}
</script>
<style scoped>
.actions-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
}
</style>
