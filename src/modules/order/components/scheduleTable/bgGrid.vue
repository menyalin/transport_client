<template>
  <svg
    ref="svgWrapper"
    height="100%"
    width="100%"
    version="1.1"
    baseProfile="full"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1,
    }"
  >
    <line
      x1="0"
      y1="0"
      x2="100%"
      y2="0"
      stroke="black"
      opacity="1"
    />
    <g
      v-for="(day, ind) of days"
      :key="day.title"
    >
      <rect
        v-if="day.isToday"
        :x="ind * dayWidth + leftShift"
        :y="0"
        height="100%"
        :width="dayWidth"
        fill="green"
        opacity="0.05"
      />

      <line
        :x1="dayWidth / 4 + ind * dayWidth + leftShift"
        y1="0"
        :x2="dayWidth / 4 + ind * dayWidth + leftShift"
        y2="100%"
        stroke="darkblue"
        opacity="0.2"
      />
      <line
        :x1="dayWidth / 2 + ind * dayWidth + leftShift"
        y1="0"
        :x2="leftShift + dayWidth / 2 + ind * dayWidth"
        y2="100%"
        stroke="black"
        opacity="0.25"
      />
      <line
        :x1="(dayWidth / 4) * 3 + ind * dayWidth + leftShift"
        y1="0"
        :x2="(dayWidth / 4) * 3 + ind * dayWidth + leftShift"
        y2="100%"
        stroke="darkblue"
        opacity="0.2"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: 'SvgGrid',
  props: {
    leftShift: {
      // Отступ равный ширине столбца
      type: Number,
      required: true,
    },
    days: {
      type: Array,
      required: true,
    },
    tableWidth: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dayWidth() {
      return (this.tableWidth - this.leftShift) / this.days.length
    },
  },
}
</script>
<style scoped></style>
