<template>
  <v-card>
    <v-card-title class="text-h6"> Список документов </v-card-title>
    <v-card-text>
      <order-docs-list-form
        v-model="tmpDocs"
        :isValid="isValidDocs(tmpDocs)"
        :readonly="isReadonlyDocs"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('cancel')"> Отмена </v-btn>
      <v-btn
        color="primary"
        :disabled="isReadonlyDocs || !isValidDocs(tmpDocs)"
        @click="saveHandler"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { OrderDocsListForm, useOrderDocs } from '@/entities/order'

defineOptions({ name: 'DocListForm' })

const props = defineProps({
  docs: Array,
})

const emit = defineEmits(['save', 'cancel'])

const tmpDocs = ref([])
const { isValidDocs, isReadonlyDocs } = useOrderDocs()

function saveHandler() {
  emit('save', tmpDocs.value)
}

watch(
  () => props.docs,
  (docs = []) => {
    if (!docs) tmpDocs.value = []
    else tmpDocs.value = [...docs]
  },
  { immediate: true, deep: true }
)
</script>

<style scoped></style>
