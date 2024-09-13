<template>
  <v-table id="table">
    <caption class="text-left font-weight-medium">
      Контроль дополнительных событий
    </caption>
    <thead>
      <tr>
        <th>Заголовок</th>
        <th>Действительно до</th>
        <th>Дней до напоминания</th>
        <th>Комментарий</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, ind) in items" :key="ind">
        <td>{{ row.title }}</td>
        <td class="text-center">
          {{ row.expDate ? new Date(row.expDate).toLocaleDateString() : '' }}
        </td>
        <td class="text-center">
          {{ row.daysBeforeRemind }}
        </td>
        <td>{{ row.note }}</td>
        <td>
          <v-icon color="orange" class="mr-3" @click="openDialog(ind)">
            mdi-pencil
          </v-icon>
          <v-icon color="red" @click="deleteItem(ind)"> mdi-delete </v-icon>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <v-btn color="primary" small class="ma-2" @click="openDialog(-1)">
        Добавить напоминание
      </v-btn>
    </tfoot>

    <v-dialog v-model="dialog" max-width="1000" persistent>
      <v-card>
        <v-card-title> Новое напоминание </v-card-title>
        <v-card-text class="notification-form">
          <v-text-field
            v-model="v$.title.$model"
            label="Заголовок"
            :errorMessages="titleErrors"
            outlined
            dense
            @blur="v$.title.$touch()"
          />
          <div class="dates-row">
            <DateTimeInput
              v-model="v$.expDate.$model"
              label="Действительно до"
              hidePrependIcon
              hideTimeInput
              :errorMessages="expDateErrors"
              @blur="v$.expDate.$touch()"
            />
            <v-text-field
              v-model="v$.daysBeforeRemind.$model"
              label="Дней до напоминания"
              class="days-count"
              outlined
              dense
              :error-messages="daysBeforeRemindErrors"
              @blur="v$.daysBeforeRemind.$touch()"
            />
            <v-text-field
              v-model="v$.note.$model"
              label="Примечание"
              outlined
              dense
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="mr-3" @click="cancelHandler"> Отмена </v-btn>
          <v-btn
            color="primary"
            :disabled="isInvalidEditableItem"
            @click="addItem"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-table>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'

import DateTimeInput from '../dateTimeInput.vue'

import { useNotificationForm, type INotification } from './useNotificationForm'

export default defineComponent({
  name: 'AdditionalNotifications',
  components: {
    DateTimeInput,
  },
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: {
      type: Array as PropType<INotification[]>,
      required: true,
    },
  },
  emits: ['change'],
  setup() {
    const {
      state,
      v$,
      titleErrors,
      isInvalidEditableItem,
      expDateErrors,
      daysBeforeRemindErrors,
      resetFormHandler,
    } = useNotificationForm()
    return {
      resetFormHandler,
      state,
      v$,
      titleErrors,
      isInvalidEditableItem,
      expDateErrors,
      daysBeforeRemindErrors,
    }
  },
  data() {
    return {
      dialog: false,
      currentIdx: -1,
    }
  },

  methods: {
    openDialog(idx: number) {
      if (idx !== -1) {
        this.currentIdx = idx
        this.state = this.items[idx]
      } else {
        this.currentIdx = -1
      }
      this.dialog = true
    },
    clearEditableItem() {
      this.currentIdx = -1
      this.resetFormHandler()
    },
    addItem() {
      const tmpItems: INotification[] = [...this.items]
      if (this.currentIdx !== null)
        tmpItems.splice(this.currentIdx, 1, { ...this.state })
      else tmpItems.push({ ...this.state })
      this.$emit('change', tmpItems)
      this.dialog = false
      this.clearEditableItem()
    },
    cancelHandler() {
      this.dialog = false
      this.clearEditableItem()
    },
    async deleteItem(idx: number) {
      // TODO: add confirmation
      // const res = await this.$confirm('Уверены?')
      // if (res) {
      const tmpItems = [...this.items]
      tmpItems.splice(idx, 1)
      this.$emit('change', tmpItems)
      // }
    },
  },
})
</script>
<style scoped>
#table {
  margin-bottom: 30px;
}
thead {
  font-size: 0.8rem;
}
.dates-row {
  display: grid;
  grid-template-columns: 200px 150px auto;
  flex-direction: row;
  gap: 10px;
}
</style>
