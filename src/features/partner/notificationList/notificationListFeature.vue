<template>
  <div class="notification_list_wrapper">
    <NotificationListItem
      v-for="item of items"
      :partnerId="partnerId"
      :key="item._id"
      :item="item"
      @edit="editHandler"
      @delete="deleteHandler"
    />
  </div>
</template>
<script>
import { useListData } from './model'
import { NotificationListItem } from '@/entities/partner'

export default {
  name: 'NotificationListFeature',
  components: {
    NotificationListItem,
  },

  props: {
    partnerId: String,
    items: {
      type: Array,
    },
  },
  setup(props, ctx) {
    const { deleteHandler, editHandler } = useListData(props, ctx)
    return {
      deleteHandler,
      editHandler,
    }
  },
}
</script>
<style scoped>
.notification_list_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
}
</style>
