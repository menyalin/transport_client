<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="med-book-wrapper">
      <v-text-field
        hide-details
        outlined
        :value="params.number"
        dense
        label="Номер"
        @change="change($event, 'number')"
      />
      <app-date-time-input
        label="Дата выдачи"
        :value="params.issueDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'issueDate')"
      />
      <app-date-time-input
        label="Аттестация до"
        :value="params.certifiedBeforeDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'certifiedBeforeDate')"
      />
      <app-date-time-input
        label="Ежегодная комиссия от"
        :value="params.annualCommisionDate"
        hide-prepend-icon
        hide-time-input
        @change="change($event, 'annualCommisionDate')"
      />
      <v-textarea
        label="Примечание"
        :value="params.note"
        outlined
        @change="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'MedBook',
  components: {
    AppBlockTitle,
    AppDateTimeInput,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    title: String,
  },
  data() {
    return {
      params: {
        number: null,
        issueDate: null,
        certifiedBeforeDate: null,
        annualCommisionDate: null,
        note: null,
      },
    }
  },
  computed: {
    ...mapGetters([]),
    fields() {
      return Object.keys(this.params)
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.fields.forEach((f) => {
            this.params[f] = val[f]
          })
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
.med-book-wrapper {
  display: grid;
  grid-template-columns: 500px 300px 300px 300px;
  margin: 10px;
  grid-gap: 15px;
}
</style>
