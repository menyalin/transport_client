<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

defineOptions({ name: 'TableColumnSettings' })

export interface TableColumnHeader {
  value: string
  title: string
  default?: boolean
}

const props = defineProps<{
  allHeaders: TableColumnHeader[]
  defaultHeaders?: string[]
  listSettingsName: string
}>()

const model = defineModel<string[]>({ default: () => [] })

const tmpHeaders = ref<string[]>([])

watch(
  model,
  (val) => {
    if (Array.isArray(val)) tmpHeaders.value = [...val]
  },
  { immediate: true }
)

onMounted(() => {
  if (!model.value || model.value.length === 0) {
    const savedHeaders = JSON.parse(localStorage.getItem(props.listSettingsName) || 'null')
    if (savedHeaders) tmpHeaders.value = savedHeaders
    else
      tmpHeaders.value = props.defaultHeaders?.length
        ? props.defaultHeaders
        : props.allHeaders.filter((i) => i.default).map((i) => i.value)
    model.value = tmpHeaders.value
  }
})

function toggleHeader(field: string) {
  if (tmpHeaders.value.includes(field)) {
    tmpHeaders.value = tmpHeaders.value.filter((i) => i !== field)
  } else {
    tmpHeaders.value = [...tmpHeaders.value, field]
  }
  localStorage.setItem(props.listSettingsName, JSON.stringify(tmpHeaders.value))
  model.value = tmpHeaders.value
}
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <v-btn color="primary" v-bind="menuProps" icon variant="text">
        <v-icon size="small"> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-2">
      <v-switch
        v-for="field of allHeaders"
        :key="field.value"
        :model-value="tmpHeaders.includes(field.value)"
        :label="field.title"
        hide-details
        @update:model-value="toggleHeader(field.value)"
      />
    </v-list>
  </v-menu>
</template>

<style scoped></style>
