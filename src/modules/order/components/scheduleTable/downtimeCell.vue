<template>
  <div
    :class="classes"
    @dblclick.stop="dblclickHandler"
  >
    <div class="px-3 text-caption">
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
  justify-content: space-around;
  user-select: none;
}
.holiday {
  background-color: sandybrown;
}
.repair {
  background-color: rgb(185, 184, 184);
}
</style>
