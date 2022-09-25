<template>
  <v-card>
    <v-card-title class="text-h6">
      Список документов
    </v-card-title>

    <v-card-text>
      <div>
        <v-btn
          text
          small
          color="primary"
          outlined
          :disabled="readonly"
          @click="addDoc"
        >
          Добавить
        </v-btn>
      </div>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Тип*
              </th>
              <th class="text-left">
                Номер
              </th>
              <th class="text-left">
                Комментарий
              </th>
              <th class="text-left">
                Статус*
              </th>
              <th class="text-left">
                Дата получения
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in tmpDocs"
              :key="idx"
            >
              <td>
                <v-select
                  v-model="item.type"
                  dense
                  hide-details
                  :items="docTypes"
                  class="my-2"
                />
              </td>
              <td>
                <v-text-field
                  v-model.trim="item.number"
                  dense
                  hide-details
                />
              </td>
              <td>
                <v-text-field
                  v-model.trim="item.note"
                  dense
                  hide-details
                />
              </td>
              <td>
                <v-select
                  v-model="item.status"
                  dense
                  hide-details
                  :items="docStatuses"
                />
              </td>
              <td>
                <v-text-field
                  v-model="item.date"
                  type="date"
                  dense
                  hide-details
                />
              </td>
              <td>
                <v-icon
                  small
                  :disabled="readonly"
                  @click="deleteRow(idx)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="$emit('cancel')">
        Отмена
      </v-btn>

      <v-btn
        color="primary"
        :disabled="readonly || invalidItems"
        @click="saveHandler"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD'
export default {
    name: 'DocListForm',
  props: {
    docs: Array,
  },
  data() {
    return {
      tmpDocs: [],
    }
  },
  computed: {
    docTypes() {
      return this.$store.getters.documentTypes
    },
    docStatuses() {
      return this.$store.getters.documentStatuses
    },
    readonly() {
      return !this.$store.getters.hasPermission('order:setDocs')
    },
    invalidItems() {
      return !!this.tmpDocs.filter(item => !item.type || !item.status).length
    }
  },
  watch: {
    docs: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpDocs = val.map(i => ({
          ...i,
          date: dayjs(i.date).format(DATE_FORMAT)
        }))
      },
    },
  },
  methods: {
    saveHandler() {
      this.$emit('save', this.tmpDocs.map(i => ({
        ...i,
        date: i.date ? new Date(i.date).toISOString() : new Date().toISOString()
      })))
    },
    addDoc() {
      if (!Array.isArray(this.tmpDocs)) this.tmpDocs = []
      else this.tmpDocs.push({date: dayjs().format(DATE_FORMAT)})
    },
    deleteRow(idx) {
      this.tmpDocs.splice(idx, 1)
    },
  },
}
</script>
<style scoped></style>
