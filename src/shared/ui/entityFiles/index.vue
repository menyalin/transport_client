<template>
  <v-card elevation="1" :loading="loading">
    <v-card-title><BlockTitle>Файлы</BlockTitle></v-card-title>
    <v-card-text>
      <FileList
        :items="items"
        @remove="removeItemHandler"
        @download="downloadItemHandler"
        @updateNote="updateNoteHandler"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn icon="mdi-refresh" @click="getFilesHandler" />
      <v-btn size="small" @click="openDialogHandler"> Добавить файлы </v-btn>
    </v-card-actions>
    <v-dialog
      :model-value="dialog"
      @update:model-value="dialog = $event"
      max-width="1200"
      persistent
    >
      <v-card>
        <v-card-title>Файлы</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="selectedFiles"
            clearable
            placeholder="Укажите файлы для загрузки"
            multiple
            truncate-length="30"
            :disabled="uploading"
          />
          <SelectedFiles v-model="selectedFiles" :uploadProgress="uploadProgress" />
          <div v-if="uploadErrors.length" class="mt-4">
            <div class="text-error text-subtitle-2 mb-1">Ошибки загрузки:</div>
            <div v-for="err in uploadErrors" :key="err.name" class="text-error text-caption">
              {{ err.name }} — {{ err.error }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelOrAbortHandler" :disabled="loading && !uploading">
            {{ uploading ? 'Отменить загрузку' : 'Отмена' }}
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            @click="uploadFilesHandler"
            :disabled="!selectedFiles.length || uploading"
          >
            Прикрепить файлы
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup>
import { useEntityFiles } from './useEntityFiles'
import FileList from './fileList.vue'
import { BlockTitle } from '@/shared/ui'
import SelectedFiles from './selectedFiles.vue'

defineOptions({ name: 'EntityFiles' })

const props = defineProps({
  itemId: { type: String, required: true },
  docType: { type: String, required: true },
})

const {
  items,
  dialog,
  loading,
  uploading,
  uploadFilesHandler,
  getFilesHandler,
  openDialogHandler,
  cancelOrAbortHandler,
  selectedFiles,
  uploadProgress,
  uploadErrors,
  downloadItemHandler,
  removeItemHandler,
  updateNoteHandler,
} = useEntityFiles(props)
</script>
<style scoped>
.files-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
}
.title-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
