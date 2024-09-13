<template>
  <div class="notification_list_wrapper">
    <NotificationListItem
      v-for="item of items"
      :key="item._id"
      :partnerId="partnerId"
      :item="item"
      @edit="editHandler"
      @delete="deleteHandler"
      @switch-status="switchStatusHandler"
    />
  </div>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import { NotificationListItem } from '@/entities/partner'

import { useListData } from './model'

export default defineComponent({
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
    const { deleteHandler, editHandler, switchStatusHandler } = useListData(
      props,
      ctx
    )
    return {
      deleteHandler,
      editHandler,
      switchStatusHandler,
    }
  },
})
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
