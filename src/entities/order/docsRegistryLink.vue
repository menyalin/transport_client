<template>
  <small v-if="!docsRegistry">Рейс не включен в опись</small>
  <router-link v-else :to="url">{{ linkText }}</router-link>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'OrderFormDocsRegistryLink',
  props: {
    docsRegistry: Object,
  },
  setup({ docsRegistry }) {
    const url = computed(() => '/accounting/docsRegistry/' + docsRegistry._id)

    const dateStr = computed(() =>
      new Date(docsRegistry.createdAt).toLocaleDateString()
    )

    const statusStr = computed(() =>
      store.getters.docsRegistryStatusesMap.get(docsRegistry.status)
    )

    const linkText = computed(
      () =>
        `Опись №${docsRegistry.number} от ${dateStr.value} (${statusStr.value})`
    )

    return {
      linkText,
      url,
    }
  },
}
</script>
<style scoped></style>
