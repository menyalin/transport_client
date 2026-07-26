<template>
  <div class="wrapper">
    <div class="text-headline-small">Контакты:</div>
    <v-btn color="primary" size="small" @click="addItem"> Добавить контакт </v-btn>
    <div v-if="emptyContacts" class="text-label-large">Контакты отсутствуют</div>
    <ItemCard
      v-for="(item, idx) of items"
      :item="item"
      :key="idx"
      @edit="editHandler(idx)"
      @remove="removeItem(idx)"
    />
    <v-dialog
      :model-value="dialog"
      @update:model-value="dialog = $event"
      max-width="800"
      persistent
    >
      <ContactForm :item="editedItem" @cancel="cancelHandler" @submit="submitHandler" />
    </v-dialog>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import ItemCard from './card.vue'
import ContactForm from './form.vue'

defineOptions({ name: 'ContactsInfo' })

const items = defineModel({ type: Array, default: () => [] })

const dialog = ref(false)
const editedItem = ref(null)
const emptyContacts = computed(() => !items.value || items.value?.length === 0)

function addItem() {
  dialog.value = true
}

function removeItem(idx) {
  items.value = items.value.filter((i, index) => index !== idx)
}

function editHandler(idx) {
  editedItem.value = { ...items.value[idx] }
  dialog.value = true
}

function cancelHandler() {
  dialog.value = false
  editedItem.value = null
}

function submitHandler(formState) {
  const tmpItems = [...(items.value || [])]
  if (editedItem.value) tmpItems.splice(editedItem.value.idx, 1, formState)
  else tmpItems.push(formState)
  items.value = tmpItems
  dialog.value = false
  editedItem.value = null
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  max-width: 700px;
}
.note {
  font-style: italic;
}
</style>
