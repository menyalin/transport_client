<template>
  <div class="wrapper ma-2">
    <div class="date-settings">
      <v-btn
        icon
        @click="$emit('incDate', -1)"
      >
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <app-date-time-input
        :value="date"
        hideDetails
        hideTimeInput
        hidePrependIcon
        @change="changeDate"
      />
      <v-btn
        icon
        @click="$emit('incDate', 1)"
      >
        <v-icon>mdi-arrow-right-bold</v-icon>
      </v-btn>
    </div>
    <v-btn
      color="primary"
      text
      small
      to="/orders/group"
    >
      Создать группу рейсов
    </v-btn>
  </div>
</template>
<script>
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'ScheduleSettings',
  components: {
    AppDateTimeInput,
  },
  props: {
    date: {
      type: String,
    },
  },
  methods: {
    changeDate(val) {
      this.$emit('setDate', val)
    },
  },
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.date-settings {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  margin-top: 10px;
}
.date-settings > * {
  margin: 5px;
}
</style>
