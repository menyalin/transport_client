<template>
  <v-simple-table id="table">
    <template #default>
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
            {{ new Date(row.expDate).toLocaleDateString() }}
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
        <v-btn
          text
          color="primary"
          small
          class="ma-2"
          @click="openDialog(null)"
        >
          Добавить напоминание
        </v-btn>
      </tfoot>

      <v-dialog v-model="dialog" max-width="1000" persistent>
        <v-card>
          <v-card-title> Новое напоминание </v-card-title>
          <v-card-text class="notification-form">
            <v-text-field
              v-model="v$.editableItem.title.$model"
              label="Заголовок"
              :errorMessages="titleErrors"
              outlined
              dense
              @blur="v$.editableItem.title.$touch()"
            />
            <div class="dates-row">
              <DateTimeInput
                v-model="v$.editableItem.expDate.$model"
                label="Действительно до"
                hidePrependIcon
                hideTimeInput
                :errorMessages="expDateErrors"
                @blur="v$.editableItem.expDate.$touch()"
              />
              <v-text-field
                v-model="v$.editableItem.daysBeforeRemind.$model"
                label="Дней до напоминания"
                class="days-count"
                outlined
                dense
                :error-messages="daysBeforeRemindErrors"
                @blur="v$.editableItem.daysBeforeRemind.$touch()"
              />
              <v-text-field
                v-model="editableItem.note"
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
    </template>
  </v-simple-table>
</template>
<script>
import { useVuelidate } from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'AdditionalNotifications',
  components: {
    DateTimeInput,
  },
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
  },
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data() {
    return {
      dialog: false,
      currentIdx: null,
      editableItem: {
        title: null,
        expDate: null,
        daysBeforeRemind: null,
        note: null,
      },
    }
  },
  validations: {
    editableItem: {
      title: { required },
      expDate: { required },
      daysBeforeRemind: { required, numeric },
      note: {},
    },
  },
  computed: {
    isInvalidEditableItem() {
      return this.v$.editableItem.$invalid
    },
    itemFields() {
      return Object.keys(this.editableItem)
    },
    titleErrors() {
      let errors = []
      if (
        this.v$.editableItem.title.$dirty &&
        !this.v$.editableItem.title.required
      )
        errors.push('Заголовок не может быть пустым')
      return errors
    },
    expDateErrors() {
      let errors = []
      if (
        this.v$.editableItem.expDate.$dirty &&
        !this.v$.editableItem.expDate.required
      )
        errors.push('Укажите дату')
      return errors
    },
    daysBeforeRemindErrors() {
      let errors = []
      if (
        this.v$.editableItem.daysBeforeRemind.$dirty &&
        !this.v$.editableItem.daysBeforeRemind.required
      )
        errors.push('Не должно быть пустым')
      if (
        this.v$.editableItem.daysBeforeRemind.$dirty &&
        !this.v$.editableItem.daysBeforeRemind.numeric
      )
        errors.push('Введите число')
      return errors
    },
  },
  methods: {
    openDialog(idx) {
      if (idx !== null) {
        this.currentIdx = idx
        this.editableItem = this.items[idx]
      } else {
        this.currentIdx = null
      }
      this.dialog = true
    },
    clearEditableItem() {
      this.currentIdx = null
      this.itemFields.forEach((f) => (this.editableItem[f] = null))
    },
    addItem() {
      let tmpItems = [...this.items]
      if (this.currentIdx !== null)
        tmpItems.splice(this.currentIdx, 1, { ...this.editableItem })
      else tmpItems.push({ ...this.editableItem })
      this.$emit('change', tmpItems)
      this.dialog = false
      this.clearEditableItem()
    },
    cancelHandler() {
      this.dialog = false
      this.clearEditableItem()
    },
    async deleteItem(idx) {
      const res = await this.$confirm('Уверены?')
      if (res) {
        let tmpItems = [...this.items]
        tmpItems.splice(idx, 1)
        this.$emit('change', tmpItems)
      }
    },
  },
}
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
