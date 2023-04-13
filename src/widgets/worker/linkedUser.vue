<template>
  <div>
    <pick-user />
  </div>
</template>
<script>
import { PickUser } from '@/features/worker'

export default {
  name: 'LinkedUserWidget',
  components: {
    PickUser,
  },
  props: {
    worker: {
      type: Object,
      required: true,
    },
  },
  setup() {},
}
</script>
