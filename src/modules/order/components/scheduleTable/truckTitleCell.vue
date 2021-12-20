<template>
  <div class="px-2 title-wrapper">
    <router-link
      :to="baseUrl + id"
      draggable="false"
    >
      {{ title.toLowerCase() }}
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'TruckTitleCell',
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    baseUrl: '/profile/trucks/',
  }),
}
</script>
<style scoped>
.title-wrapper {
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
</style>
