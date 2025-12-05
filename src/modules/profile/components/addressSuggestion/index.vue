<template>
  <v-autocomplete
    v-model:searchInput="search"
    clearable
    autoSelectFirst
    variant="solo"
    :modelValue="model"
    :items="items"
    :loading="isLoading"
    hideNoData
    :customFilter="() => true"
    itemTitle="value"
    placeholder="Начните вводить адрес для поиска"
    prependIcon="mdi-database-search"
    returnObject
    @update:model-value="change"
  />
</template>
<script>
import { AddressService } from '@/shared/services'

export default {
  name: 'AddressSuggestion',
  data() {
    return {
      model: null,
      search: null,
      isLoading: false,
      items: [],
      timeout: null,
    }
  },
  watch: {
    async search(val) {
      if (!val || !val?.trim()) {
        this.model = null
        this.items = []
        return
      }
      if (this.isLoading) return
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        try {
          this.isLoading = true
          this.items = await AddressService.getSuggestions(val)
          this.isLoading = false
        } catch (e) {
          this.isLoading = false
          this.$store.commit('setError', e.message)
        }
      }, 500)
    },
  },
  methods: {
    addressCompare() {
      return true
    },
    change(val) {
      this.$emit('change', val)
    },
  },
}
</script>
<style></style>
