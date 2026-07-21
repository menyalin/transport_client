<template>
  <CardSection title="Контроль дополнительных событий">
    <AdditionalNotificationsTable
      :items="items"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
      @add="handleAdd"
    />

    <AdditionalNotificationForm
      v-model="dialog"
      :item="editableItem"
      :isEdit="isEdit"
      @save="handleSave"
    />
  </CardSection>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { CardSection } from '@/shared/ui'
import AdditionalNotificationsTable from './AdditionalNotificationsTable.vue'
import AdditionalNotificationForm from './AdditionalNotificationForm.vue'

const items = defineModel({ type: Array, default: () => [] })

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const dialog = ref(false)
const isEdit = ref(false)
const currentEditIndex = ref(null)

const editableItem = reactive({
  title: null,
  expDate: null,
  daysBeforeRemind: null,
  note: null,
})

const handleAdd = () => {
  resetEditableItem()
  isEdit.value = false
  currentEditIndex.value = null
  dialog.value = true
}

const handleEdit = (index) => {
  if (index !== null && index !== undefined && items.value[index]) {
    Object.assign(editableItem, { ...items.value[index] })
    isEdit.value = true
    currentEditIndex.value = index
    dialog.value = true
  }
}

const handleSave = (itemData) => {
  const newItems = [...items.value]

  if (isEdit.value && currentEditIndex.value !== null) {
    newItems.splice(currentEditIndex.value, 1, { ...itemData })
  } else {
    newItems.push({ ...itemData })
  }

  items.value = newItems
  dialog.value = false
  resetEditableItem()
}

function handleDelete(index) {
  if (index === null || index === undefined) return
  const result = confirmDelete()
  if (result) {
    items.value = [...items.value.slice(0, index), ...items.value.slice(index + 1)]
  }
}

const resetEditableItem = () => {
  Object.assign(editableItem, {
    title: null,
    expDate: null,
    daysBeforeRemind: null,
    note: null,
  })
}

const confirmDelete = () => {
  return confirm('Уверены, что хотите удалить это напоминание?')
}
</script>

<style scoped>
h3 {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
