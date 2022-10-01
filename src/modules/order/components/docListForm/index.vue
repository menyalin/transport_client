<template>
  <v-card>
    <v-card-title 
      class="text-h6"
    > 
      Список документов 
    </v-card-title>
    <v-card-text>
      <app-form
        v-model="tmpDocs"
        :isValid="isValidDocs(tmpDocs)"
        :readonly="isReadonlyDocs"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn 
        @click="$emit('cancel')"
      > 
        Отмена 
      </v-btn>
      <v-btn
        color="primary"
        :disabled="isReadonlyDocs || !isValidDocs(tmpDocs)"
        @click="saveHandler"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import AppForm from './form.vue'
import { useOrderDocs } from '../../hooks/useOrderDocs.js'

export default {
  name: 'DocListForm',
  components: {
    AppForm,
  },
  setup() {
    const { isValidDocs, isReadonlyDocs } = useOrderDocs()
    return {
      isValidDocs,
      isReadonlyDocs,
    }
  },
  props: {
    docs: Array,
  },
  data() {
    return {
      tmpDocs: [],
    }
  },
  watch: {
    docs: {
      deep: true,
      immediate: true,
      handler: function (val) {  
        this.tmpDocs = [ ...val]
      },
    },
  },

  methods: {
    saveHandler() {
      this.$emit('save', this.tmpDocs)
    },
  },
}
</script>
<style scoped></style>
