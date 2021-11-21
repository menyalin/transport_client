<template>
  <div
    :class="classes"
    @dblclick.stop="dblclickHandler"
  >
    <div class="row-text">
      {{ downtime.title }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'DowntimeCell',
  props: {
    itemId: String,
  },
  computed: {
    classes() {
      let classes = ['downtime-wrapper', this.downtime.type]
      return classes
    },
    downtime() {
      return this.$store.getters.downtimesMap.get(this.itemId)
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
  font-weight: 300;
  overflow: hidden;
  user-select: none;
}
.holiday {
  background-color: sandybrown;
}
.repair {
  background-color: rgb(185, 184, 184);
}
</style>
