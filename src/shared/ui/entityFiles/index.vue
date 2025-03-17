<template>
  <v-card elevation="1" :loading="loading">
    <v-card-title>
      <h5>Файлы</h5>
    </v-card-title>
    <v-card-text>
      <FileList
        :items="items"
        @remove="removeItemHandler"
        @download="downloadItemHandler"
        @updateNote="updateNoteHandler"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn icon @click="getFilesHandler">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn small color="primary" @click="openDialogHandler">
        Добавить файлы
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="dialog" max-width="1200" persistent>
      <v-card>
        <v-card-title>Файлы</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="selectedFiles"
            clearable
            placeholder="Укажите файлы для загрузки"
            multiple
            truncate-length="30"
          />
          <SelectedFiles
            v-model="selectedFiles"
            :uploadProgress="uploadProgress"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelDialogHandler" :disabled="loading">
            Отменить загрузку файлов</v-btn
          >
          <v-spacer />
          <v-btn
            color="primary"
            @click="uploadFilesHandler"
            :disabled="!selectedFiles.length || loading"
          >
            Прикрепить файлы
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { useEntityFiles } from './useEntityFiles'
import FileList from './fileList.vue'
import SelectedFiles from './selectedFiles.vue'

export default {
  name: 'EntityFiles',
  components: { FileList, SelectedFiles },
  props: {
    itemId: { type: String, required: true },
    docType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {
      items,
      dialog,
      loading,
      uploadFilesHandler,
      getFilesHandler,
      openDialogHandler,
      cancelDialogHandler,
      selectedFiles,
      uploadProgress,
      downloadItemHandler,
      removeItemHandler,
      updateNoteHandler,
    } = useEntityFiles(props)

    return {
      uploadFilesHandler,
      getFilesHandler,
      items,
      loading,
      openDialogHandler,
      cancelDialogHandler,
      dialog,
      selectedFiles,
      uploadProgress,
      downloadItemHandler,
      removeItemHandler,
      updateNoteHandler,
    }
  },
}
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
