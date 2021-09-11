<template>
  <div>
    <app-schedule-table />
  </div>
</template>
<script>
import AppScheduleTable from '../../components/scheduleTable'
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
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeScreen)
  },
  mounted() {
    window.addEventListener('resize', this.resizeScreen)
    this.resizeScreen()
  },
  methods: {
    resizeScreen() {
      this.screenWidth = window.innerWidth - 110
    },
  },
}
</script>
<style></style>
