<template>
  <v-simple-table>
    <template v-slot:default>
      <caption class="text-left font-weight-medium">
        Контроль дополнительных событий
      </caption>
      <thead>
        <tr>
          <th>Заголовок</th>
          <th>Действительно до</th>
          <th>Дней до напоминания</th>
          <th>Коментарий</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, ind) in items"
          :key="ind"
        >
          <td>{{ row.title }}</td>
          <td class="text-center">
            {{ new Date(row.expDate).toLocaleDateString() }}
          </td>
          <td class="text-center">
            {{ row.daysBeforeRemind }}
          </td>
          <td>{{ row.note }}</td>
          <td>
            <v-icon
              color="orange"
              class="mr-3"
              @click="openDialog(ind)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              color="red"
              @click="deleteItem(ind)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <v-btn
          text
          color="primary"
          small
          class="ma-2"
          @click="openDialog"
        >
          Добавить напоминание
        </v-btn>
      </tfoot>

      <v-dialog
        v-model="dialog"
        max-width="1000"
        persistent
      >
        <v-card>
          <v-card-title> Новое напоминание </v-card-title>
          <v-card-text class="notification-form">
            <v-text-field
              v-model="editableItem.title"
              label="Заголовок"
              outlined
              dense
              hide-details
            />
            <div class="dates-row">
              <app-date-time-input
                v-model="editableItem.expDate"
                label="Действительно до"
                hidePrependIcon
                hideTimeInput
              />
              <v-text-field
                v-model="editableItem.daysBeforeRemind"
                label="Дней до напоминания"
                type="number"
                class="days-count"
                outlined
                dense
                hide-details
              />
              <v-text-field
                v-model="editableItem.note"
                label="Примечание"
                outlined
                dense
                hide-details
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cancelHandler">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="addItem"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-simple-table>
</template>
<script>
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'AdditionalNotifications',
  components: {
    AppDateTimeInput,
  },
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
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
  computed: {
    itemFields() {
      return Object.keys(this.editableItem)
    },
  },
  methods: {
    openDialog(idx) {
      if (!!idx) {
        this.currentIdx = idx
        this.editableItem = this.items[idx]
      } else {
        this.currentIdx = null
      }
      this.dialog = true
    },
    clearEditableItem() {
      this.itemFields.forEach((f) => (this.editableItem[f] = null))
    },
    addItem() {
      let tmpItems = [...this.items]
      tmpItems.push({ ...this.editableItem })
      this.$emit('change', tmpItems)
      this.dialog = false
      this.clearEditableItem()
    },
    cancelHandler() {
      this.dialog = false
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
thead {
  font-size: 0.8rem;
}
.notification-form > * {
  margin-bottom: 20px;
}
.dates-row {
  display: grid;
  grid-template-columns: 150px 150px auto;
  flex-direction: row;
  gap: 10px;
}
</style>
