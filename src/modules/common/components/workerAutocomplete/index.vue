<template>
  <v-autocomplete
    v-if="!labelOnly"
    :value="value"
    :label="label"
    :outlined="outlined"
    clearable
    :loading="loading"
    :dense="dense"
    no-filter
    :items="items"
    :filter="() => true"
    :search-input="searchString"
    @update:search-input="handleSearchInputUpdate"
    @change="handleChange"
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
    label: String,
    outlined: Boolean,
    dense: Boolean,
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
