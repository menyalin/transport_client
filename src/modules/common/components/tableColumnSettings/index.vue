<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props" icon variant="text">
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
<script setup>
import { ref, watch, onMounted } from 'vue'

defineOptions({ name: 'TableColumnSettings' })

const model = defineModel({ type: Array, default: () => [] })

const props = defineProps({
  allHeaders: {
    type: Array,
    required: true,
  },
  defaultHeaders: Array,
  listSettingsName: {
    type: String,
    required: true,
  },
})

const tmpHeaders = ref([])

watch(
  model,
  (val) => {
    if (Array.isArray(val)) tmpHeaders.value = [...val]
  },
  { immediate: true }
)

onMounted(() => {
  if (!model.value || model.value.length === 0) {
    const savedHeaders = JSON.parse(localStorage.getItem(props.listSettingsName))
    if (savedHeaders) tmpHeaders.value = savedHeaders
    else
      tmpHeaders.value = props.defaultHeaders?.length
        ? props.defaultHeaders
        : props.allHeaders.filter((i) => i.default).map((i) => i.value)
    model.value = tmpHeaders.value
  }
})

function toggleHeader(field) {
  if (tmpHeaders.value.includes(field)) {
    tmpHeaders.value = tmpHeaders.value.filter((i) => i !== field)
  } else {
    tmpHeaders.value = [...tmpHeaders.value, field]
  }
  localStorage.setItem(props.listSettingsName, JSON.stringify(tmpHeaders.value))
  model.value = tmpHeaders.value
}
</script>
<style scoped></style>
