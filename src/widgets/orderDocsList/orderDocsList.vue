<template>
  <v-card>
    <v-card-title class="text-h6"> Список документов </v-card-title>
    <v-card-text>
      <order-docs-list-form
        v-model="tmpDocs"
        :isValid="isValidDocs(tmpDocs)"
        :readonly="isReadonlyDocs"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('cancel')"> Отмена </v-btn>
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
import { OrderDocsListForm, useOrderDocs } from '@/entities/order'

export default {
  name: 'DocListForm',
  components: {
    OrderDocsListForm,
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
      immediate: true,
      deep: true,
      handler: function (val) {
        if (!val) this.tmpDocs = []
        else this.tmpDocs = [...val]
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
