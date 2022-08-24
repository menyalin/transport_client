<template>
  <v-autocomplete 
    :value="value"
    :label="label"
    :outlined="outlined" 
    clearable
    :loading="loading"
    :dense="dense" 
    no-filter
    :items="items"
    :filter="()=> true"
    :search-input="searchString"
    @update:search-input="handleSearchInputUpdate"
    @change="handleChange"
  />
</template>
<script>
import workerService from '@/modules/profile/services/worker.service'
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
  },
  setup({ value }, ctx) {
    const { handleChange, items, handleSearchInputUpdate, searchString, loading } = useServerData({ctx, service: workerService, propValue: value})
    return { searchString, handleChange, items, handleSearchInputUpdate, loading  }
  },
}
</script>
<style>
  
</style>