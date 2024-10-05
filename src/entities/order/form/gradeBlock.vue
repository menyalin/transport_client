<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="grade-block">
      <v-rating
        :value="params.grade"
        :readonly="disabled"
        :length="3"
        large
        color="red"
        background-color="grey lighten-1"
        @input="change($event, 'grade')"
      />

      <v-text-field
        hide-details
        outlined
        :value="params.note"
        :disabled="disabled"
        dense
        class="px-3"
        :style="{ width: '100%' }"
        label="Примечание"
        @input="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'

export default {
  name: 'GradeBlock',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    title: String,
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      params: {
        grade: null,
        note: null,
      },
    }
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.params.grade = val.grade
          this.params.note = val.note
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
  },
}
</script>
<style scoped>
.grade-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
