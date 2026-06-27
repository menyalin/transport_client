<template>
  <div :class="classes" @dblclick.stop="dblclickHandler">
    <div class="row-text">
      {{ downtimeStartTime }}
      {{ downtime.title }}
    </div>
    <div v-if="downtime.type === 'repair' && partner" class="row-text">
      {{ partner.name }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

defineOptions({ name: 'DowntimeCell' })

const props = defineProps({
  itemId: String,
})

const store = useStore()
const router = useRouter()

const downtime = computed(() => {
  return store.getters.downtimesMap.get(props.itemId)
})

const classes = computed(() => {
  return ['downtime-wrapper', downtime.value.type]
})

const downtimeStartTime = computed(() => {
  return dayjs(downtime.value.startPositionDate).format('HH:mm')
})

const partner = computed(() => {
  if (!downtime.value.partner) return null
  return store.getters.partnersMap.get(downtime.value.partner)
})

const downtimeUrl = computed(() => {
  return '/profile/downtimes/' + props.itemId
})

function dblclickHandler() {
  router.push(downtimeUrl.value)
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
.row-text {
  padding-left: 3px;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: -0.023em;
  white-space: nowrap;
  font-weight: 300;
}
.holiday {
  background-color: sandybrown;
}
.repair {
  background-color: rgb(185, 184, 184);
}
</style>
