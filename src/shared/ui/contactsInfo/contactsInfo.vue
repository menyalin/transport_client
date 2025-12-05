<template>
  <div class="wrapper">
    <div class="text-h6">Контакты:</div>
    <v-btn color="primary" size="small" @click="addItem">Добавить контакт</v-btn>
    <div v-if="emptyContacts" class="text-subtitle-2">Контакты отсутствуют</div>
    <ItemCard v-for="(item, idx) of items" :key="idx" :item="item" @edit="editHandler(idx)" @remove="removeItem(idx)" />
    <v-dialog
maxWidth="800"
persistent :modelValue="dialog" @update:model-value="$emit('update:dialog', $event)"
>
      <ContactForm :item="editedItem" @cancel="cancelHandler" @submit="submitHandler" />
    </v-dialog>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import ItemCard from './card.vue'
import ContactForm from './form.vue'
export default {
  name: 'ContactsInfo',
  components: {
    ItemCard,
    ContactForm,
  },
  model: {
    prop: 'items',
    event: 'change',
  },

  props: {
    items: Array,
  },
  setup(props, ctx) {
    const dialog = ref(false)
    const editedItem = ref(null)
    const emptyContacts = computed(() => !props.items || props.items?.length === 0)
    function addItem() {
      dialog.value = true
    }
    function removeItem(idx) {
      emitChange(props.items.filter((i, index) => index !== idx))
    }

    function editHandler(idx) {
      editedItem.value = { ...props.items[idx] }
      dialog.value = true
    }

    function emitChange(value) {
      ctx.emit('change', value)
    }

    function cancelHandler() {
      dialog.value = false
      editedItem.value = null
    }

    function submitHandler(formState) {
      const tmpItems = [...(props.items || [])]
      if (editedItem.value) tmpItems.splice(editedItem.value.idx, 1, formState)
      else tmpItems.push(formState)
      emitChange(tmpItems)
      dialog.value = false
      editedItem.value = null
    }

    return {
      emptyContacts,
      removeItem,
      addItem,
      dialog,
      cancelHandler,
      submitHandler,
      editHandler,
      editedItem,
    }
  },
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
