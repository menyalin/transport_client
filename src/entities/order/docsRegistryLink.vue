<template>
  <small v-if="!docsRegistry">Рейс не включен в опись</small>
  <router-link v-else :to="url">{{ linkText }}</router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'OrderFormDocsRegistryLink' })

const props = defineProps({
  docsRegistry: Object,
})

const store = useStore()

const url = computed(() => '/accounting/docsRegistry/' + props.docsRegistry._id)

const dateStr = computed(() => new Date(props.docsRegistry.createdAt).toLocaleDateString())

const statusStr = computed(() =>
  store.getters.docsRegistryStatusesMap.get(props.docsRegistry.status)
)

const linkText = computed(
  () => `Опись №${props.docsRegistry.number} от ${dateStr.value} (${statusStr.value})`
)
</script>

<style scoped></style>
