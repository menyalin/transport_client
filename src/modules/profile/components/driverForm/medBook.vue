<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="med-book-wrapper">
      <div class="first-column">
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
        <div class="date-input-row">
          <app-date-time-input
            label="Аттестация до"
            :value="params.certifiedBeforeDate"
            hide-prepend-icon
            hide-time-input
            @change="change($event, 'certifiedBeforeDate')"
          />
          <v-chip
            v-if="certificateValidityPeriod"
            class="my-1 mx-4"
            :color="chipColor(certificateValidityPeriod)"
          >
            {{ certificateValidityPeriod }}
          </v-chip>
        </div>
        <div class="date-input-row">
          <app-date-time-input
            label="Ежегодная комиссия от"
            :value="params.annualCommisionDate"
            hide-prepend-icon
            hide-time-input
            @change="change($event, 'annualCommisionDate')"
          />
          <v-chip
            v-if="daysBeforeMedExamination"
            class="my-1 mx-4"
            :color="chipColor(daysBeforeMedExamination)"
          >
            {{ daysBeforeMedExamination }}
          </v-chip>
        </div>
      </div>
      <v-textarea
        label="Примечание"
        :value="params.note"
        outlined
        hide-details
        @change="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import moment from 'moment'

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
    certificateValidityPeriod() {
      if (!this.params.certifiedBeforeDate) return null
      const todaySec = moment().unix()
      const certDateSec = moment(this.params.certifiedBeforeDate).unix()
      return Math.floor((certDateSec - todaySec) / (60 * 60 * 24))
    },
    daysBeforeMedExamination() {
      const lastDate = moment(this.params.annualCommisionDate)
        .add(1, 'year')
        .unix()
      const todaySec = moment().unix()
      return Math.floor((lastDate - todaySec) / (60 * 60 * 24))
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
