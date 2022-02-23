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
                Тип
              </th>
              <th class="text-left">
                Номер
              </th>
              <th class="text-left">
                Комментарий
              </th>
              <th class="text-left">
                Статус
              </th>
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
        @click="saveHandler"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
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
  },
  watch: {
    docs: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpDocs = val
      },
    },
  },
  methods: {
    saveHandler() {
      this.$emit('save', this.tmpDocs)
    },
    addDoc() {
      this.tmpDocs.push({})
    },
  },
}
</script>
<style scoped></style>
