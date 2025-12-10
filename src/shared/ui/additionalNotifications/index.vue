<template>
  <AdditionalNotificationsContainer
    :items="items"
    :loading="loading"
    @change="handleChange"
  />
</template>

<script>
import AdditionalNotificationsContainer from './AdditionalNotificationsContainer.vue'

export default {
  name: 'AdditionalNotifications',

  components: {
    AdditionalNotificationsContainer,
  },

  model: {
    prop: 'items',
    event: 'change',
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup(_props, { emit }) {
    const handleChange = (newItems) => {
      emit('change', newItems)
    }

    return {
      handleChange,
    }
  },
}
</script>
