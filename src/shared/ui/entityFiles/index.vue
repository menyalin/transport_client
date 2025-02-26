<template>
  <div class="wrapper">
    <h5>Файлы:</h5>
    <v-btn icon @click="getFilesHandler"><v-icon>mdi-refresh</v-icon></v-btn>
    <v-file-input
      chips
      show-size
      truncate-length="15"
      @change="uploadFilesHandler"
    />
    <div>{{ items }}</div>
  </div>
</template>
<script>
import { useEntityFiles } from './useEntityFiles'
export default {
  name: 'EntityFiles',
  props: {
    itemId: String,
    docType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { uploadFilesHandler, getFilesHandler, items } = useEntityFiles(props)
    return {
      uploadFilesHandler,
      getFilesHandler,
      items,
    }
  },
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
}
</style>
