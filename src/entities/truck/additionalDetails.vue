<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-wrapper">
      <div id="platon">
        <v-text-field
          label="Платон №"
          :model-value="params.platonNumber"
          hide-details
          @change="change($event, 'platonNumber')"
        />
        <DateTimeInput
          label="Дата замены"
          :model-value="params.platonDate"
          @update:model-value="change($event, 'platonDate')"
          hide-details
        />
      </div>
      <div id="tachograph">
        <v-text-field
          label="Тахограф №"
          :model-value="params.tachographNumber"
          hide-details
          @change="change($event, 'tachographNumber')"
        />
        <DateTimeInput
          label="Дата сделующей калибровки"
          :model-value="params.tachographExpDate"
          @update:model-value="change($event, 'tachographExpDate')"
          hide-details
        />
        <v-text-field
          label="Примечание (тахограф)"
          :model-value="params.tachographNote"
          hide-details
          @change="change($event, 'tachographNote')"
        />
      </div>

      <div id="transponder">
        <v-text-field
          label="Транспондер, №"
          :model-value="params.transponderNumber"
          hide-details
          @change="change($event, 'transponderNumber')"
        />
        <DateTimeInput
          label="Дата выдачи"
          :model-value="params.transponderDate"
          @update:model-value="change($event, 'transponderDate')"
          hide-details
        />
      </div>
      <div id="fuel-card">
        <v-text-field
          label="Топливная карта"
          :model-value="params.fuelCardNumber"
          hide-details
          @change="change($event, 'fuelCardNumber')"
        />
        <DateTimeInput
          label="Дата выдачи карты"
          :model-value="params.fuelCardDate"
          @update:model-value="change($event, 'fuelCardDate')"
          hide-details
        />
        <v-text-field
          label="Примечание (Топливная карта)"
          :model-value="params.fuelCardNote"
          hide-details
          @change="change($event, 'fuelCardNote')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'AdditionalDetails',
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
    truckType: String,
  },
  data() {
    return {
      params: {
        diagnosticCardExpDate: null,
        diagnosticCardNote: null,
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
  gap: 10px;
}

#tachograph {
  display: grid;
  grid-template-columns: 190px 190px 350px;
  gap: 10px;
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
  gap: 10px;
}
</style>
