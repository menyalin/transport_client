<template>
  <v-card>
    <v-card-title class="text-h6">
      Список документов
    </v-card-title>
    <v-card-text>
      <app-form v-model="tmpDocs" />
    </v-card-text>
    <v-card-actions>
      <v-btn 
        v-if="!hideCancelBtn"
        @click="$emit('cancel')"
      >
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
import AppForm from './form.vue'


export default {
  name: 'DocListForm',
  components: {
    AppForm
  },
  props: {
    hideCancelBtn: {type: Boolean, default: false}, 
    docs: Array,
  },
  data() {
    return {
      tmpDocs: [],
    }
  },
  computed: {
    readonly() {
      return !this.$store.getters.hasPermission('order:setDocs')
    },
  },


  methods: {
    saveHandler() {
      this.$emit('save', this.tmpDocs.map(i => ({
        ...i,
        date: i.date ? new Date(i.date).toISOString() : new Date().toISOString()
      })))
    },
  
  },
}
</script>
<style scoped></style>
