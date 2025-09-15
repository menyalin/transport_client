<template>
  <v-autocomplete
    v-if="!labelOnly"
    v-bind="$attrs"
    :model-value="value"
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
<script>
import { computed } from 'vue'
import { WorkerService } from '@/shared/services'
import { useServerData } from '@/modules/common/hooks/useServerData'

export default {
  name: 'WorkerAutocomplete',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String,
    labelOnly: { type: Boolean, default: false },
  },
  setup({ value }, ctx) {
    const {
      handleChange,
      items,
      handleSearchInputUpdate,
      searchString,
      loading,
    } = useServerData({ ctx, service: WorkerService, propValue: value })

    const title = computed(() => {
      if (!value) return ''
      // if (!items || !Array.isArray(items)) return ''
      const item = items.value.find((i) => i.value === value)
      return item?.text
    })

    return {
      searchString,
      handleChange,
      items,
      handleSearchInputUpdate,
      loading,
      title,
    }
  },
}
</script>
<style></style>
