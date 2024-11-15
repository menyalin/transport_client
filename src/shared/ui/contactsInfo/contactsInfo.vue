<template>
  <div class="wrapper">
    <div class="text-h6">Контакты:</div>
    <v-btn color="primary" small @click="addItem"> Добавить контакт </v-btn>
    <div v-if="emptyContacts" class="text-subtitle-2">Контакты отсутствуют</div>
    <ItemCard
      v-for="(item, idx) of items"
      :item="item"
      :key="idx"
      @remove="removeItem(idx)"
    />
    <v-dialog max-width="800" persistent v-model="dialog">
      <ContactForm @cancel="dialog = false" @submit="dialog = false" />
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
    const emptyContacts = computed(
      () => !props.items || props.items?.length === 0
    )
    function addItem() {
      dialog.value = true
    }
    function removeItem(idx) {
      emitChange(props.items.filter((i, index) => index !== idx))
    }

    function emitChange(value) {
      ctx.emit('change', value)
    }

    return {
      emptyContacts,
      removeItem,
      addItem,
      dialog,
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
