<template>
  <div class="px-2">
    <router-link
      :to="baseUrl + id"
      draggable="false"
    >
      {{ title }}
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
<style></style>
