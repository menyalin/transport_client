<template>
  <div class="docs-wrapper" :class="{ invalid: !isValid }">
    <h5>Документы:</h5>
    <div class="btn-wrapper">
      <v-btn
        text
        small
        color="primary"
        outlined
        :disabled="readonly || !isValid"
        @click="openGroupDocDialog"
        class="mb-4 mt-2"
      >
        Добавить документы
      </v-btn>
    </div>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-center" width="10px">Включать в опись</th>
            <th class="text-left">Тип*</th>
            <th class="text-left">Номер</th>
            <th class="text-left">Комментарий</th>
            <th class="text-left">Статус*</th>
            <th class="text-left">Дата получения</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) of docs"
            :key="idx"
            :class="{ 'not-accepted': item.status !== 'accepted' }"
          >
            <td class="text-center">
              <v-simple-checkbox
                v-model="item.addToRegistry"
                dense
                hide-details
                color="primary"
              />
            </td>
            <td>
              <v-select
                v-model="item.type"
                dense
                hide-details
                :disabled="readonly"
                :items="docTypes"
                class="my-2"
              />
            </td>
            <td>
              <v-text-field
                v-model.trim="item.number"
                dense
                hide-details
                :disabled="readonly"
              />
            </td>
            <td>
              <v-text-field
                v-model.trim="item.note"
                dense
                hide-details
                :disabled="readonly"
              />
            </td>
            <td>
              <v-select
                v-model="item.status"
                dense
                hide-details
                :items="docStatuses"
                :disabled="readonly"
              />
            </td>
            <td>
              <v-text-field
                v-model="item.date"
                type="date"
                dense
                hide-details
                :disabled="readonly"
              />
            </td>
            <td>
              <v-icon small :disabled="readonly" @click="deleteRow(idx)">
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <app-group-dialog
      :dialog="groupDialog"
      @close="closeGroupDocDialog"
      @pushDocs="addGroup"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import appGroupDialog from './groupDialog.vue'

const DATE_FORMAT = 'YYYY-MM-DD'

export default {
  name: 'DocListForm',
  components: {
    appGroupDialog,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      docs: [],
      groupDialog: false,
    }
  },
  computed: {
    docTypes() {
      return this.$store.getters.documentTypes
    },
    docStatuses() {
      return this.$store.getters.documentStatuses
    },
    invalidItems() {
      return !!this.value.filter((item) => !item.type || !item.status).length
    },
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return null
        this.docs = val.map((i) => ({
          ...i,
          addToRegistry: i.addToRegistry === undefined ? true : i.addToRegistry,
          date: dayjs(i.date).format(DATE_FORMAT),
        }))
      },
    },
    docs: {
      deep: true,
      handler: function (val) {
        this.$emit(
          'change',
          val.map((i) => ({
            ...i,
            date: i.date ? new Date(i.date).toISOString() : null,
          }))
        )
      },
    },
  },
  methods: {
    addGroup(val) {
      this.docs.push(...val)
    },
    openGroupDocDialog() {
      this.groupDialog = true
    },
    closeGroupDocDialog() {
      this.groupDialog = false
    },
    deleteRow(idx) {
      this.docs.splice(idx, 1)
    },
  },
}
</script>
<style scoped>
.docs-wrapper {
  margin: 5px;
  padding: 15px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
}
.not-accepted {
  background-color: rgba(255, 0, 0, 0.4);
}
</style>
