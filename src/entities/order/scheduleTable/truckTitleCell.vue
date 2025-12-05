<template>
  <div class="px-1 title-wrapper">
    <div class="row-number">
      <small>{{ idx + 1 }}</small>
    </div>
    <router-link :to="baseUrl + id" draggable="false" class="router-link">
      {{ title.toLowerCase().replace(/\s+/g, '') }}
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'AppTruckTitleCell',
  props: {
    idx: Number,
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
    display: flex;
    flex-direction: row;
    gap: 4px;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
    justify-content: space-between;
  }
  .router-link {
    text-decoration: none;
  }
  .row-number {
    width: 1rem;
  }
</style>
