<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-wrapper">
      <div id="platon">
        <v-text-field
          label="Платон №"
          :value="params.platonNumber"
          outlined
          dense
          hide-details
          @change="change($event, 'platonNumber')"
        />
        <app-date-time-input
          label="Дата замены"
          :value="params.platonDate"
          hide-prepend-icon
          hide-time-input
          @change="change($event, 'platonDate')"
        />
      </div>
      <div id="tachograph">
        <v-text-field
          label="Тахограф №"
          :value="params.tachographNumber"
          outlined
          dense
          hide-details
          @change="change($event, 'tachographNumber')"
        />
        <app-date-time-input
          label="Дата сделующей калибровки"
          :value="params.tachographExpDate"
          hide-prepend-icon
          hide-time-input
          @change="change($event, 'tachographExpDate')"
        />
        <v-text-field
          label="Примечание (тахограф)"
          :value="params.tachographNote"
          outlined
          dense
          hide-details
          @change="change($event, 'tachographNote')"
        />
      </div>

      <div id="transponder">
        <v-text-field
          label="Транспондер, №"
          :value="params.transponderNumber"
          outlined
          dense
          hide-details
          @change="change($event, 'transponderNumber')"
        />
        <app-date-time-input
          label="Дата выдачи"
          :value="params.transponderDate"
          hide-prepend-icon
          hide-time-input
          @change="change($event, 'transponderDate')"
        />
      </div>
      <div id="fuel-card">
        <v-text-field
          label="Топливная карта"
          :value="params.fuelCardNumber"
          outlined
          dense
          hide-details
          @change="change($event, 'fuelCardNumber')"
        />
        <app-date-time-input
          label="Дата выдачи карты"
          :value="params.fuelCardDate"
          hide-prepend-icon
          hide-time-input
          @change="change($event, 'fuelCardDate')"
        />
        <v-text-field
          label="Примечание (Топливная карта)"
          :value="params.fuelCardNote"
          outlined
          dense
          hide-details
          @change="change($event, 'fuelCardNote')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'AdditionalDetails',
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
    truckType: String,
  },
  data() {
    return {
      params: {
        platonNumber: null,
        platonDate: null,
        tachographNumber: null,
        tachographExpDate: null,
        tachographNote: null,
        transponderNumber: null,
        transponderDate: null,
        fuelCardNumber: null,
        fuelCardDate: null,
        fuelCardNote: null,
      },
    }
  },
  computed: {
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
.fields-wrapper {
  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  margin-bottom: 20px;
}
.fields-wrapper > * {
  margin-right: 10px;
  margin-bottom: 10px;
}
#platon {
  display: grid;
  grid-template-columns: 220px 190px;
  gap: 5px;
}

#tachograph {
  display: grid;
  grid-template-columns: 190px 190px 350px;
  gap: 5px;
}

#transponder {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
#transponder > * {
  margin-right: 5px;
}
#fuel-card {
  display: grid;
  grid-template-columns: 190px 190px 350px;
  gap: 5px;
}
</style>
