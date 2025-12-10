<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">Заголовок</th>
          <th class="text-center">Действительно до</th>
          <th class="text-center">Дней до напоминания</th>
          <th class="text-left">Комментарий</th>
          <th class="text-center">Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center py-4">
            <v-progress-circular indeterminate color="primary" size="24" />
            <span class="ml-2">Загрузка...</span>
          </td>
        </tr>

        <tr v-else-if="!items.length">
          <td colspan="5" class="text-center py-8 grey--text">
            Нет напоминаний
          </td>
        </tr>

        <tr v-for="(item, index) in items" :key="`notification-${index}`">
          <td class="font-weight-medium">
            {{ item.title || '-' }}
          </td>
          <td class="text-center">
            {{ formatDate(item.expDate) }}
          </td>
          <td class="text-center">
            {{ item.daysBeforeRemind || '-' }}
          </td>
          <td>
            <span v-if="item.note">{{ item.note }}</span>
            <span v-else class="grey--text text--lighten-1">-</span>
          </td>
          <td class="text-center">
            <v-btn
              icon
              small
              color="orange"
              class="mr-2"
              @click="$emit('edit', index)"
              :disabled="loading"
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              small
              color="red"
              @click="$emit('delete', index)"
              :disabled="loading"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="5" class="pa-2">
            <v-btn
              color="primary"
              @click="$emit('add')"
              :disabled="loading"
              small
            >
              Добавить напоминание
            </v-btn>
          </td>
        </tr>
      </tfoot>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'AdditionalNotificationsTable',

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

  emits: ['add', 'edit', 'delete'],

  setup(_props) {
    // Функция форматирования даты
    const formatDate = (dateString) => {
      if (!dateString) return '-'

      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-'

        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      } catch (error) {
        console.error('Ошибка форматирования даты:', error)
        return '-'
      }
    }

    return {
      formatDate,
    }
  },
}
</script>
