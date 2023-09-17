<template>
  <div class="notification_list_wrapper">
    тут будет список настроек оповещений
    {{ items }}
  </div>
</template>
<script>
export default {
  name: 'NotificationListFeature',
  props: {
    items: {
      type: Array,
    },
  },
}
</script>
<style scoped>
.notification_list_wrapper {
  display: flex;
}
</style>
