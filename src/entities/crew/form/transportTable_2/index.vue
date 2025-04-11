<template>
  <div>
    <v-simple-table dense class="mb-3">
      <template #default>
        <thead>
          <tr>
            <th class="date-col">Дата начала</th>
            <th class="date-col">Дата завершения</th>
            <th>Грузовик</th>
            <th>Прицеп</th>
            <th>Примечание</th>
            <th class="text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, ind) in tableData"
            :key="ind"
            :class="{
              'not-saved-row': !item._id || item.updated,
            }"
          >
            <td>{{ item.startDateStr }}</td>
            <td>{{ item.endDateStr }}</td>
            <td>{{ item.truck }}</td>
            <td>{{ item.trailer }}</td>
            <td>{{ item.note }}</td>

            <td class="action-column text-center">
              <v-icon
                v-if="item.allowEdit"
                color="green"
                class="px-1"
                @click="editLastItem"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="item.allowDelete"
                color="red"
                class="px-1"
                @click="popItem"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-btn color="primary" @click="addItemHandler" small text>
      Добавить запись
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <TransportForm
        :item="editedItem"
        :minDateValue="editableItemMinDate"
        :readonlyStartDate="readonlyStartDate"
        :trucks="trucks"
        :trailers="trailers"
        @cancel="closeDialog"
        @save="pushItem"
      />
    </v-dialog>
  </div>
</template>
<script>
import TransportForm from './transportForm.vue'
import { useTransportTableData } from './useTransportTableData'

export default {
  name: 'TransportTable',
  components: { TransportForm },
  props: {
    items: Array,
    trucks: Array,
    trailers: Array,
    crewEditable: Boolean,
    hideAddButton: Boolean,
    crewStartDate: String,
  },
  setup(props, ctx) {
    const {
      tableData,
      editLastItem,
      popItem,
      dialog,
      editedItem,
      closeDialog,
      addItemHandler,
      pushItem,
      editableItemMinDate,
      readonlyStartDate,
    } = useTransportTableData(props, ctx)

    return {
      tableData,
      editLastItem,
      popItem,
      dialog,
      editedItem,
      closeDialog,

      addItemHandler,
      pushItem,
      editableItemMinDate,
      readonlyStartDate,
    }
  },
}
</script>
<style scoped></style>
