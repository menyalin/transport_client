<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  allHeaders: {
    type: Array,
    required: true,
  },
  listSettingsName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])

const defaultFields = computed(() => props.allHeaders.filter((i) => i.default).map((i) => i.value))

const getFields = () => {
  try {
    const savedFields = JSON.parse(localStorage.getItem(props.listSettingsName))
    return savedFields?.length ? savedFields : defaultFields.value
  } catch {
    return defaultFields.value
  }
}

const activeFields = ref(getFields())

const activeHeaders = computed(() =>
  props.allHeaders.filter((i) => activeFields.value.includes(i.value))
)

function inputHandler(field) {
  if (activeFields.value.includes(field)) {
    activeFields.value = activeFields.value.filter((i) => i !== field)
  } else {
    activeFields.value.push(field)
  }
}

watch(
  activeFields,
  () => {
    try {
      localStorage.setItem(props.listSettingsName, JSON.stringify(activeFields.value))
    } catch {
      console.log('localStorage недоступен!')
    } finally {
      emit('change', activeHeaders.value)
    }
  },
  { immediate: true, deep: true }
)
</script>
<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon size="small" variant="text">
        <v-icon size="small"> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-2">
      <v-switch
        v-for="field of allHeaders"
        :key="field.value"
        :label="field.hiddenTitle || field.text || field.title"
        :model-value="activeFields.includes(field.value)"
        hide-details
        @update:model-value="inputHandler(field.value)"
      />
    </v-list>
  </v-menu>
</template>

<style></style>
