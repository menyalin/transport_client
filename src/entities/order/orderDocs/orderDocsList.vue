<template>
  <v-card>
    <v-card-title class="text-h6">Список документов</v-card-title>
    <v-card-text>
      <OrderDocsListForm v-model="tmpDocs" :isValid="isValidDocs(tmpDocs)" :readonly="isReadonlyDocs" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('cancel')">Отмена</v-btn>
      <v-btn color="primary" :disabled="isReadonlyDocs || !isValidDocs(tmpDocs)" @click="saveHandler">Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, watch } from 'vue'
import { OrderDocsListForm, useOrderDocs } from '@/entities/order'

export default {
  name: 'DocListForm',
  components: {
    OrderDocsListForm,
  },
  props: {
    docs: Array,
  },
  setup(props, ctx) {
    const tmpDocs = ref([])
    const { isValidDocs, isReadonlyDocs } = useOrderDocs()

    async function saveHandler() {
      ctx.emit('save', tmpDocs.value)
    }

    watch(
      () => props.docs,
      (docs = []) => {
        if (!docs) tmpDocs.value = []
        else tmpDocs.value = [...docs]
      },
      { immediate: true, deep: true }
    )
    return {
      isValidDocs,
      isReadonlyDocs,
      saveHandler,
      tmpDocs,
    }
  },
}
</script>
<style scoped></style>
