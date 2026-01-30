<template>
  <div id="settings-wrapper">
    <v-text-field
      v-model="tmpSettings.date"
      label="Дата"
      outlined
      :disabled="disabled"
      type="date"
      hide-details
      dense
      :style="{ 'max-width': '200px' }"
    />

    <v-select
      v-model="tmpSettings.tks"
      label="ТК"
      :items="carriers"
      item-value="_id"
      item-text="name"
      multiple
      dense
      outlined
      hide-details
      :style="{ 'max-width': '220px' }"
    />

    <v-select
      v-model="tmpSettings.type"
      label="Тип тарифа"
      :items="$store.getters.salaryTariffTypes"
      dense
      outlined
      hide-details
      :style="{ 'max-width': '220px' }"
    />
    <v-select
      v-model="tmpSettings.consigneeTypes"
      label="Типы грузополучателей"
      :items="$store.getters.partnerGroups"
      dense
      multiple
      outlined
      clearable
      hide-details
      :style="{ 'max-width': '300px' }"
    />
    <v-select
      v-model="tmpSettings.liftCapacity"
      label="Грузоподъемность"
      :items="$store.getters.liftCapacityTypes"
      dense
      multiple
      outlined
      hide-details
      :style="{ 'max-width': '220px' }"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'SalaryTariffCommonSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    carriers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tmpSettings: {
        date: null,
        tks: [],
        type: null,
        liftCapacity: [],
        consigneeTypes: [],
      },
    }
  },

  watch: {
    tmpSettings: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.$emit('change', {
          ...val,
          date: val.date ? new Date(val.date).toISOString() : null,
        })
      },
    },
  },
  created() {
    if (this.settings?.group) this.tmpSettings = { ...this.settings }
    else {
      // default values
      this.tmpSettings.truckKind =
        this.$store.getters.companySettings?.defaultTruckKind || null
      this.tmpSettings.liftCapacity.push(
        this.$store.getters.companySettings?.defaultLiftCapacity || null
      )

      this.tmpSettings.date = dayjs().format('YYYY-MM-DD')
    }
  },
}
</script>
<style scoped>
#settings-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin: 10px;
}
</style>
