<template>
  <v-autocomplete
    v-if="!labelOnly"
    :model-value="value"
    :label="label"
    clearable
    :loading="loading"
    no-filter
    :items="items"
    :customFilter="() => true"
    :search="searchString"
    @update:search="handleSearchInputUpdate"
    @update:model-value="handleChange"
  />
  <span v-else> {{ title }} </span>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { WorkerService } from '@/shared/services'

defineOptions({ name: 'WorkerAutocomplete' })

defineProps({
  label: String,
  labelOnly: { type: Boolean, default: false },
})

const value = defineModel()

let itemSelected = !!value.value
const loading = ref(false)
const items = ref([])
const searchString = ref('')

onMounted(async () => {
  if (value.value) {
    loading.value = true
    WorkerService.getForAutocomplete({ id: value.value })
      .then((val) => {
        if (val?.length)
          items.value = val.map((i) => ({
            value: i._id,
            text: i.fullName || i.name,
          }))
      })
      .finally(() => {
        loading.value = false
        itemSelected = true
      })
  }
})

function handleChange(val) {
  itemSelected = true
  value.value = val
}

async function handleSearchInputUpdate(val) {
  searchString.value = val
  loading.value = true
  if (itemSelected) {
    itemSelected = false
  } else {
    items.value = ((await WorkerService.getForAutocomplete({ searchStr: val })) || []).map((i) => ({
      value: i._id,
      text: i.fullName || i.name,
    }))
  }
  loading.value = false
}

const title = computed(() => {
  if (!value.value) return ''
  const item = items.value.find((i) => i.value === value.value)
  return item?.text
})
</script>
<style></style>
