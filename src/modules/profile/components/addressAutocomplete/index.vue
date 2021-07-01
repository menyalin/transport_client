<template>
  <v-autocomplete
    clearable
    auto-select-first
    solo
    :value="model"
    @change="change"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    hide-no-data
    :filter="() => true"
    item-text="value"
    placeholder="Начните вводить адрес для поиска"
    prepend-icon="mdi-database-search"
    return-object
  />
</template>
<script>
import AddressService from '../../services/address.service'

export default {
  name: 'AddressAutocomplete',
  data() {
    return {
      model: null,
      search: null,
      isLoading: false,
      items: [],
      timeout: null,
    }
  },
  methods: {
    addressCompare() {
      return true
    },
    change(val) {
      this.$emit('change', val)
    },
  },
  watch: {
    async search(val) {
      if (!val?.trim()) {
        this.model = null
        this.items = []
        return
      }
      if (this.isLoading) return
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        this.isLoading = true
        this.items = await AddressService.getSuggestions(val)
        this.isLoading = false
      }, 500)
    },
  },
}
</script>
<style></style>
