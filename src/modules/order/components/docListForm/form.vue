<template>
  <div>
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
            v-for="(item, idx) in docs"
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
  </div>
</template>
<script>
import dayjs from 'dayjs'
const DATE_FORMAT = 'YYYY-MM-DD'

export default {
  name: 'DocListForm',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array
    },
    readonly: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      docs: []
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
      return !!this.value.filter(item => !item.type || !item.status).length
    }
  },
  watch: {  
    docs: {
      deep: true,
      handler: function(val) {
        console.log( 'val', val)
        this.$emit('change', [ ...val.map(i => ({
          ...i,
          date: !!i.date ?  new Date(i.date).toISOString() : null         
        }))])
      }
    }
  },
  created() {
    this.docs = this.value.map(i => ({
          ...i,
          date: dayjs(i.date).format(DATE_FORMAT)
        }))
  },
  methods: {
    addDoc() {
      this.docs.push({date: dayjs().format(DATE_FORMAT)})
    },
    deleteRow(idx) {
      this.docs.splice(idx, 1)
    },
  }
}
</script>
<style scoped>
  
</style>