<template>
  <div>
    screenWidth: {{ screenWidth }}
    <app-schedule-table
      :columns="scheduleColumns"
      :rows="scheduleRows"
    />
  </div>
</template>
<script>
import AppScheduleTable from '../../components/scheduleTable'
import mockTrucks from './mockTrucks'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
  },

  data() {
    return {
      screenWidth: null,
    }
  },
  computed: {
    scheduleColumns() {
      return [
        '2021-09-10',
        '2021-09-11',
        '2021-09-12',
        '2021-09-13',
        '2021-09-14',
      ]
    },
    scheduleRows() {
      return mockTrucks
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeScreen)
  },
  mounted() {
    this.resizeScreen()
    window.addEventListener('resize', this.resizeScreen)
  },
  methods: {
    resizeScreen() {
      this.screenWidth = window.innerWidth - 110
    },
  },
}
</script>
<style></style>
