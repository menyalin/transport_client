<template>
  <div class="mb-4">
    <h3 class="mb-4">Контроль дополнительных событий</h3>

    <!-- Таблица для отображения списка -->
    <AdditionalNotificationsTable
      :items="items"
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
      @add="handleAdd"
    />

    <!-- Форма добавления/редактирования -->
    <AdditionalNotificationForm
      v-model="dialog"
      :item="editableItem"
      :isEdit="isEdit"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import AdditionalNotificationsTable from './AdditionalNotificationsTable.vue'
import AdditionalNotificationForm from './AdditionalNotificationForm.vue'

export default {
  name: 'AdditionalNotificationsContainer',

  components: {
    AdditionalNotificationsTable,
    AdditionalNotificationForm,
  },

  model: {
    prop: 'items',
    event: 'change',
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    // Состояние диалога
    const dialog = ref(false)
    const isEdit = ref(false)
    const currentEditIndex = ref(null)

    // Редактируемый элемент
    const editableItem = reactive({
      title: null,
      expDate: null,
      daysBeforeRemind: null,
      note: null,
    })

    // Обработчики событий
    const handleAdd = () => {
      resetEditableItem()
      isEdit.value = false
      currentEditIndex.value = null
      dialog.value = true
    }

    const handleEdit = (index) => {
      if (index !== null && index !== undefined && props.items[index]) {
        // Создаем копию элемента во избежание прямого мутации
        Object.assign(editableItem, { ...props.items[index] })
        isEdit.value = true
        currentEditIndex.value = index
        dialog.value = true
      }
    }

    const handleSave = (itemData) => {
      const newItems = [...props.items]

      if (isEdit.value && currentEditIndex.value !== null) {
        // Редактирование существующего элемента
        newItems.splice(currentEditIndex.value, 1, { ...itemData })
      } else {
        // Добавление нового элемента
        newItems.push({ ...itemData })
      }

      emit('change', newItems)
      dialog.value = false
      resetEditableItem()
    }

    function handleDelete(index) {
      if (index === null || index === undefined) return
      const result = confirmDelete()
      if (result) {
        const newItems = [...props.items]
        newItems.splice(index, 1)

        emit('change', newItems)
      }
    }

    // Вспомогательные функции
    const resetEditableItem = () => {
      Object.assign(editableItem, {
        title: null,
        expDate: null,
        daysBeforeRemind: null,
        note: null,
      })
    }

    const confirmDelete = () => {
      // В реальном приложении здесь можно использовать $confirm или другой диалог
      return window.confirm('Уверены, что хотите удалить это напоминание?')
    }

    return {
      dialog,
      isEdit,
      editableItem,
      handleAdd,
      handleEdit,
      handleSave,
      handleDelete,
    }
  },
}
</script>

<style scoped>
h3 {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
