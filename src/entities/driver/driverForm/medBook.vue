<template>
  <div>
    <div>
      <AppBlockTitle>{{ title }}</AppBlockTitle>
    </div>
    <div class="med-book-wrapper">
      <div class="first-column">
        <v-text-field
          hideDetails
          variant="outlined"
       density="compact"
          :modelValue="params.number"
         
          label="Номер"
          @change="change($event, 'number')"
        />
        <DateTimeInput
          label="Дата выдачи"
          :value="params.issueDate"
          hidePrependIcon
          hideTimeInput
          outlined
          hideDetails
          dense
          @change="change($event, 'issueDate')"
        />
        <div class="date-input-row">
          <DateTimeInput
            label="Аттестация до"
            :value="params.certifiedBeforeDate"
            hidePrependIcon
            hideTimeInput
            outlined
            hideDetails
            dense
            @change="change($event, 'certifiedBeforeDate')"
          />
          <v-chip
            v-if="certificateValidityPeriod !== null"
            class="my-1 mx-4"
            :color="chipColor(certificateValidityPeriod)"
          >
            {{ certificateValidityPeriod }}
          </v-chip>
        </div>
        <div class="date-input-row">
          <DateTimeInput
            label="Ежегодная комиссия от"
            :value="params.annualCommisionDate"
            hidePrependIcon
            hideTimeInput
            hideDetails
            outlined
            dense
            @change="change($event, 'annualCommisionDate')"
          />
          <v-chip
            v-if="daysBeforeMedExamination !== null"
            class="my-1 mx-4"
            :color="chipColor(daysBeforeMedExamination)"
          >
            {{ daysBeforeMedExamination }}
          </v-chip>
        </div>
      </div>
      <v-textarea
        label="Примечание"
        :modelValue="params.note"
        variant="outlined"
       density="compact"
        hideDetails
        @change="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import AppBlockTitle from './blockTitle.vue'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'MedBook',
  components: {
    AppBlockTitle,
    DateTimeInput,
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
    certificateValidityPeriod() {
      if (!this.params.certifiedBeforeDate) return null
      const todaySec = dayjs().unix()
      const certDateSec = dayjs(this.params.certifiedBeforeDate).unix()
      return Math.floor((certDateSec - todaySec) / (60 * 60 * 24))
    },
    daysBeforeMedExamination() {
      if (!this.params.annualCommisionDate) return null
      const lastDate = dayjs(this.params.annualCommisionDate).add(1, 'year').unix()
      const todaySec = dayjs().unix()
      return Math.floor((lastDate - todaySec) / (60 * 60 * 24))
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.fields.forEach(f => {
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
    chipColor(days) {
      if (days < 14) return 'error'
      if (days < 30) return 'warning'
      return 'light-green'
    },
  },
}
</script>
<style scoped>
  .med-book-wrapper {
    display: grid;
    grid-template-columns: 300px auto;
    margin: 10px;
    grid-gap: 15px;
  }
  .first-column {
    display: grid;
    grid-gap: 10px;
  }
  .date-input-row {
    display: grid;
    grid-template-columns: 3fr auto;
    justify-content: space-between;
    align-items: center;
  }
</style>
