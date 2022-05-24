<template>
  <div
    :class="classes"
    @dblclick.stop="dblclickHandler"
  >
    <div class="row-text">
      {{ downtimeStartTime }}
      {{ downtime.title }}
    </div>
    <div
      v-if="downtime.type === 'repair' && partner"
      class="row-text text-subtitle-2"
    >
      {{ partner.name }}
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'DowntimeCell',
  props: {
    itemId: String,
  },
  computed: {
    classes() {
      return ['downtime-wrapper', this.downtime.type]
    },
    downtimeStartTime() {
      return moment(this.downtime.startPositionDate).format('HH:mm')
    },
    downtime() {
      return this.$store.getters.downtimesMap.get(this.itemId)
    },
    partner() {
      if (!this.downtime.partner) return null
      return this.$store.getters.partnersMap.get(this.downtime.partner)
    },
    downtimeUrl() {
      return '/profile/downtimes/' + this.itemId
    },
  },
  methods: {
    dblclickHandler() {
      this.$router.push(this.downtimeUrl)
    },
  },
}
</script>
<style scoped>
.downtime-wrapper {
  height: 100%;
  width: 100%;
  border: 1px dotted rgb(80, 80, 80);
  display: flex;
  flex-direction: column;
  justify-content: start;
  user-select: none;
}
.row-text {
  padding-left: 3px;
  font-size: 12px;
  line-height: 13px;
  letter-spacing: -0.023em;
  font-weight: 400;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}
.holiday {
  background-color: sandybrown;
}
.repair {
  background-color: rgb(185, 184, 184);
}
</style>
