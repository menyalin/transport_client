<template>
  <v-autocomplete
    v-model:search-input="search"
    clearable
    auto-select-first
    :value-model="model"
    :items="items"
    :loading="isLoading"
    hide-no-data
    :customFilter="() => true"
    item-title="value"
    placeholder="Начните вводить адрес для поиска"
    prepend-icon="mdi-database-search"
    return-object
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
